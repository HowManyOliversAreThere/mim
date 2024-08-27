import { DataContext } from "@/components/compositions/data-retrieval";
import { Package } from "@/lib/manifest";
import { CopyIcon } from "lucide-react";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";

import remarkGfm from "remark-gfm";

export function PackageDetailPage() {
  const dataContext = useContext(DataContext);
  const { packageName } = useParams();

  const item = dataContext.data?.packages.find(
    (pkg) => pkg.name === packageName
  );

  const [markdown, setMarkdown] = useState<string | null>(null);

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
        .then(setMarkdown);
    }
  }, [item]);

  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex w-full items-start gap-x-8">
        <aside className="sticky top-8 hidden max-w-96 shrink-0 lg:block">
          {item && <PackageInfo pkg={item} />}
        </aside>
        <main className="flex-1">
          <div className="lg:hidden">{item && <PackageInfo pkg={item} />}</div>
          <MarkdownComp markdown={markdown} />
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
  };
  return (
    <div>
      <div className="bg-slate-200 rounded py-2 px-4 flex flex-row items-center gap-x-4 text-sm justify-between">
        <div>
          <code>{command}</code>
        </div>
        <div
          onClick={() => handleCopy}
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
        code({ className, children, ...props }) {
          return (
            <code className={`${className} `} {...props}>
              {children}
            </code>
          );
        },
        pre({ children }) {
          return (
            <div className="w-full">
              <div className="overflow-scroll flex-shrink-0">
                <pre>{children}</pre>
              </div>
            </div>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
