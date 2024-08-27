import { DataContext } from "@/components/compositions/data-retrieval";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading";
import { Package } from "@/lib/manifest";
import { CopyIcon } from "lucide-react";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Link, useParams } from "react-router-dom";

import remarkGfm from "remark-gfm";
import { toast } from "sonner";

export function PackageDetailPage() {
  const dataContext = useContext(DataContext);
  const { packageName } = useParams();

  const item = dataContext.data?.packages.find(
    (pkg) => pkg.name === packageName
  );

  const [markdown, setMarkdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!item) {
      return;
    }

    let readme: string | null = null;
    if (item.path) {
      readme = `https://raw.githubusercontent.com/micropython/micropython-lib/master/${item.path}/README.md`;
    } else if (item.url) {
      readme =
        item.url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob", "")
          .replace("/tree", "") + "/README.md";
    }
    if (readme !== null) {
      fetch(readme)
        .then((res) => {
          if (res.status === 200) {
            return res.text();
          } else {
            return null;
          }
        })
        .then(setMarkdown)
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [item, markdown]);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex w-full items-start gap-x-8 min-h-dvh">
        <aside className="sticky top-8 hidden max-w-96 shrink-0 lg:block">
          {item && <PackageInfo pkg={item} />}
        </aside>
        <main className="w-full h-full">
          <div className="lg:hidden">{item && <PackageInfo pkg={item} />}</div>
          {isLoading ? (
            <div className="flex justify-center items-center h-72">
              <LoadingSpinner />
            </div>
          ) : markdown === null ? (
            <div className="text-center mt-4">
              No README found for this package 😢
            </div>
          ) : (
            <MarkdownComp markdown={markdown} />
          )}
        </main>
      </div>
    </div>
  );
}

function PackageInfo({ pkg }: { pkg: Package }) {
  return (
    <div className="flex flex-col w-full gap-y-4">
      <div>
        <h1 className="text-3xl font-bold">{pkg.name}</h1>
        <p className="text-lg text-slate-500">{pkg.description}</p>
      </div>
      <div className="flex flex-col lg:flex-col gap-y-4 gap-x-8">
        <div className="flex flex-col sm:flex-row lg:flex-col gap-y-4 gap-x-8">
          <PackageInfoData name="Install">
            <InstallCommand packageName={pkg.name} />
          </PackageInfoData>
          <PackageInfoData name="OTA Install">
            <InstallCommand packageName={pkg.name} ota={true} />
          </PackageInfoData>
        </div>
        <div className="flex flex-row lg:flex-col gap-y-4 gap-x-8">
          <PackageInfoData name="Version">{pkg.version}</PackageInfoData>
          <PackageInfoData name="Author">
            {pkg.author.length === 0 ? "-" : pkg.author}
          </PackageInfoData>
          <PackageInfoData name="License">{pkg.license}</PackageInfoData>
          {pkg.path && (
            <PackageInfoData name="Source">
              <Link
                to={`https://github.com/micropython/micropython-lib/tree/master/${pkg.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className={badgeVariants({ variant: "outline" })}
              >
                Github
              </Link>
            </PackageInfoData>
          )}
          {pkg.tags.length > 0 && (
            <PackageInfoData name="Tags">
              <div className="flex flex-wrap gap-x-2">
                {pkg.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </PackageInfoData>
          )}
        </div>
      </div>
    </div>
  );
}

function PackageInfoData({
  name,
  children,
}: PropsWithChildren<{ name: string }>) {
  return (
    <div className="flex flex-col gap-y-1">
      <div className="text-sm text-slate-500">{name}</div>
      <div>{children}</div>
    </div>
  );
}

function InstallCommand({
  packageName,
  ota = false,
}: {
  packageName: string;
  ota?: boolean;
}) {
  const command = ota
    ? `import mip; mip.install("${packageName}")`
    : `mpremote mip install ${packageName}`;
  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    toast.success(
      `${ota ? "OTA install" : "Install"} command copied to clipboard`
    );
  };

  return (
    <div>
      <div className="bg-slate-200 rounded py-2 px-4 flex flex-row items-center gap-x-4 text-sm justify-between">
        <div>
          <code>{command}</code>
        </div>
        <div
          onClick={handleCopy}
          className="hover:text-slate-900 text-slate-500 cursor-pointer"
        >
          <CopyIcon size={16} />
        </div>
      </div>
    </div>
  );
}

function MarkdownComp({ markdown }: { markdown: string | null }) {
  return (
    <ReactMarkdown
      className="markdown w-full"
      remarkPlugins={[remarkGfm]}
      components={{
        code(props) {
          // Ignoring ref and style props so they don't mess with SyntaxHighlighter
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { children, className, ref, style, ...rest } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <SyntaxHighlighter
              {...rest}
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
            />
          ) : (
            <code className={className} {...rest}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
