import { ScreenLoader } from "~/components/ScreenLoader";
import { Layout } from ".";
import { api } from "~/utils/api";
import { PosingUrl } from "@prisma/client";
import { useState } from "react";

export default function Review() {
    const getUrlsAwaitingReviewQuery = api.posingurl.getUrlsAwaitingReview.useQuery();

    if (getUrlsAwaitingReviewQuery.isLoading) {
        return <ScreenLoader />;
    }

    return (<>
        <Layout>
            <div>
                <h1 className="text-2xl font-bold">Pending Reviews</h1>
                <div className="text-sm text-neutral-400">
                    Manually review which have a confidence score between 60% and 85%
                </div>
            </div>
            <div className="flex-grow">
                {
                    getUrlsAwaitingReviewQuery.data?.length === 0 ?
                        <Empty message="No URLs to review" /> :
                        getUrlsAwaitingReviewQuery.data?.map((url) => {
                            return <UrlBox {...url} />
                        })
                }
            </div>
        </Layout>
    </>);
}

interface EmptyProps {
    message: string
}

export const Empty = ({ message }: EmptyProps) => {
    return (<>
        <div className="flex flex-col items-center justify-center h-full">
            <div className="text-lg font-bold text-neutral-300">
                {message}
            </div>
        </div>
    </>)
}

const UrlBox = (url: PosingUrl) => {
    const [showDropDown, setShowDropDown] = useState(false)
    return (<div className="shadown-md">
        <div className="flex w-full px-5 py-4 shadow-md items-center">
            <div className="mr-12">
                <div>
                    {url.url}
                </div>
                <div>
                    {url.originalUrl}
                </div>
            </div>
            <div>

            </div>
            <MetricBadge iconText="R" description="Regex" value={url.regex} disabled={false} />
            <MetricBadge iconText="J" description="Jaro" value={url.jaro} disabled={false} />
            <MetricBadge iconText="L" description="Levenshtein" value={url.levenshtein} disabled={true} />
            <MetricBadge iconText="S" description="Suspecious SSL" value={url.suspeciousSSL} disabled={false} />
            <MetricBadge iconText="I" description="Suspecious IP Range" value={url.suspeciousIPRange} disabled={false} />
            <MetricBadge iconText="C" description="Image Comparison" value={url.imageComparison} disabled={false} />
            <button onClick={e => setShowDropDown(!showDropDown)} className="ml-auto">
                More
            </button>
        </div>
        {
            showDropDown && (<>
                <Dropdown url={url} />
            </>)
        }
    </div>)
}

const MetricBadge = ({ iconText, description, value, disabled }: { iconText: string, description: string, value: string, disabled: boolean }) => {
    // Show description on hover over icon
    return (<>
        <div className={`flex items-center mr-6 ${disabled && "opacity-50"}`}>
            <div title={description} className={`h-8 w-8 rounded-full flex items-center justify-center mr-2 font-medium ${disabled ? "bg-neutral-400" : "bg-red-500 text-white"}`}>
                {iconText}
            </div>
            <div>
                {value}
            </div>
        </div>
    </>)
}

const Dropdown = ({ url }: { url: PosingUrl }) => {
    const [reviewReason, setReviewReason] = useState("")
    const reviewUrlMutation = api.posingurl.reviewUrl.useMutation()

    const reviewUrl = async (result: boolean) => {
        if (reviewReason.length === 0) {
            alert("Please enter a reason for this action")
            return
        }
        await reviewUrlMutation.mutateAsync({
            id: url.id,
            manualReviewResult: result ? "PHISHING" : "NOT_PHISHING",
            manualReviewComment: reviewReason
        })
    }
    return <>
        <div className="px-5 bg-white shadow-md pt-4 flex flex-col">
            <div className="flex">
                <div className="mr-10">
                    <div>Regex Matches: {url.regex}</div>
                    <div>Jaro Score: {url.jaro}</div>
                </div>
                <div className="mr-10">
                    <div>Levenshtein Score: {url.levenshtein}</div>
                    <div>Suspecious SSL: {url.suspeciousSSL}</div>
                </div>
                <div className="mr-10">
                    <div>Suspecious IP Range: {url.suspeciousIPRange}</div>
                    <div>Image Comparison: {url.imageComparison}</div>
                </div>
            </div>
            <div>
                <textarea value={reviewReason} onChange={e => setReviewReason(e.target.value)} cols={30} rows={5}
                    className="border border-neutral-400 w-full mt-4 p-4"
                    placeholder="Reason/Remarks for this action"
                ></textarea>
            </div>
            <div className="ml-auto my-4">
                <button onClick={e => reviewUrl(false)} className="px-4 py-2 bg-green-600 text-white font-medium rounded-l-md">Not Phishing</button>
                <button onClick={e => reviewUrl(true)} className="px-4 py-2 bg-red-500 text-white font-medium rounded-r-md">Phising</button>
            </div>
        </div>
    </>
}