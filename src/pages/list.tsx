import { PosingUrl } from "@prisma/client";
import { Layout } from ".";
import { Empty } from "./review";
import { ScreenLoader } from "~/components/ScreenLoader";
import { api } from "~/utils/api";


export default function List() {
    const getPhishingUrlsQuery = api.posingurl.readAllPhishing.useQuery()

    if (getPhishingUrlsQuery.isLoading) {
        return <ScreenLoader />;
    }

    return (<>
        <Layout>
            <div>
                <h1 className="text-2xl font-bold">Known Adversaries</h1>
                <div className="text-sm text-neutral-400">
                    Urls known to be phishing based on automated and manual review
                </div>
            </div>
            <div className="flex-grow">
                {
                    getPhishingUrlsQuery.data?.length === 0 ?
                        <Empty message="No URLs known" /> :
                        getPhishingUrlsQuery.data?.map((url) => {
                            return <DisplayPhishingUrl {...url} />
                        })
                }
            </div>
        </Layout>
    </>);
}

const DisplayPhishingUrl = (url: PosingUrl) => {

    return (<>
        <div className="w-full shadow-md flex items-center px-4 py-3 justify-between">
            <div>
                <div>
                    { url.url }
                </div>
                <div>
                    { url.originalUrl }
                </div>
            </div>
            <div>
                Confidence: {"98%"}
            </div>
            <div>
                details
            </div>
            <div>
                Manual Review
            </div>
            <button className="">Change</button>
        </div>
    </>)
}
