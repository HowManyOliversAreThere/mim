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

    const item = dataContext.data?.packages.find((pkg) => pkg.name === packageName);

    const [markdown, setMarkdown] = useState<string | null>(null);

    useEffect(() => {
        if (!item) {
            return;
        }
        fetch(`https://raw.githubusercontent.com/micropython/micropython/master/README.md`)
            .then((res) => res.text())
            .then(setMarkdown);
    }, [item]);

    return (
        <div className="flex flex-col gap-y-8">
            <div className="flex w-full max-w-7xl items-start gap-x-8">
                <aside className="sticky top-8 hidden w-96 shrink-0 lg:block">{item && <PackageInfo pkg={item} />}</aside>
                <main className="flex-1"><div className="lg:hidden">{item && <PackageInfo pkg={item} />}</div><ReactMarkdown className='markdown' remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown></main>
            </div>
        </div>
    );
}

function PackageInfo({ pkg }: { pkg: Package }) {
    return (
        <>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-y-4 gap-x-8">
                <div>
                    <h1 className="text-3xl font-bold">{pkg.name}</h1>
                    <p className="text-lg text-slate-500">{pkg.description}</p>
                </div>
                <PackageInfoData name="Install"><InstallCommand packageName={pkg.name} /></PackageInfoData>
                <PackageInfoData name="OTA Install"><InstallCommand packageName={pkg.name} ota={true} /></PackageInfoData>
                <PackageInfoData name="Author">{pkg.author.length === 0 ? '-' : pkg.author}</PackageInfoData>
                <PackageInfoData name="License">{pkg.license}</PackageInfoData>
            </div>
        </>
    );
}

function PackageInfoData({ name, children }: PropsWithChildren<{ name: string }>) {
    return (
        <div className="flex flex-col gap-y-1">
            <div className="text-sm text-slate-500">{name}</div>
            <div>{children}</div>
        </div>
    );
}


function InstallCommand({ packageName, ota = false }: { packageName: string, ota?: boolean }) {
    const command = ota ? `import mip; mip.install("${packageName}")` : `mpremote mip install ${packageName}`;
    const handleCopy = () => {
        navigator.clipboard.writeText(command);
    };
    return (
        <div>
        <div className="bg-slate-200 rounded py-2 px-4 flex flex-row items-center gap-x-4 text-sm justify-between">
            <div><code>{command}</code></div>
            <div onClick={() => handleCopy} className="hover:text-slate-900 text-slate-500 cursor-pointer"><CopyIcon size={16} /></div>
        </div>
        </div>
    );
}
