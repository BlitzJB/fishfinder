
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Legend, Cell } from 'recharts';

export default function Home() {
    const [showModal, setshowModal] = useState(false)
    const [modalValue, setModalValue] = useState("")
    return (<>
        {
            showModal && <Modal setShowModal={setshowModal} setModalValue={setModalValue} modalValue={modalValue} />
        }
        <Layout>
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="text-sm text-neutral-400">
                        Urls known to be phishing based on automated and manual review
                    </div>
                </div>
                <div className="ml-auto px-4 py-2 border border-neutral-300 rounded-md">
                    <button onClick={e => setshowModal(!showModal)}>Add Manually +</button>
                </div>
            </div>
            <div className="flex-grow relative">
                <div className="px-4 py-3 border border-neutral mt-4 flex items-center shad">
                    <div>
                        Home domains:
                    </div>
                    <div className="ml-1 border border-neutral-400 border-dashed rounded-md py-1 px-2">
                        steamcommunity.com
                    </div>
                    <div className="ml-1 border border-neutral-400 border-dashed rounded-md py-1 px-2">
                        discord.com
                    </div>
                    <div className="ml-1 py-1 px-3 border border-neutral-400 border-dashed rounded-md cursor-pointer">
                        +
                    </div>
                </div>
                <div className="h-[25%] relative flex mt-6">
                    <div className="h-full w-[25%] mr-4 border border-neutral-300 shadow-lg rounded-md flex flex-col items-center justify-center">
                        <div className="font-bold text-2xl mb-3">Avg URL Similarity</div>
                        <div className="text-5xl">93.57%</div>
                    </div>
                    <div className="h-full w-[25%] mr-4 border border-neutral-300 shadow-lg rounded-md flex flex-col items-center justify-center">
                        <div className="font-bold text-2xl mb-3">Text Filter Hits</div>
                        <div className="text-5xl">95.30%</div>
                    </div>
                    <div className="h-full w-[25%] mr-4 border border-neutral-300 shadow-lg rounded-md flex flex-col items-center justify-center">
                        <div className="font-bold text-2xl mb-3">Domain Info Hits</div>
                        <div className="text-5xl">96.78%</div>
                    </div>
                    <div className="h-full w-[25%] border border-neutral-300 shadow-lg rounded-md flex flex-col items-center justify-center">
                        <div className="font-bold text-2xl mb-3">AI Filter Hits</div>
                        <div className="text-5xl">98.22%</div>
                    </div>
                </div>
                <div className="h-[60%] relative flex flex-col">
                    <div>
                        <h1 className="text-2xl font-bold mt-4 mb-2 text-neutral-700">Detections by Day</h1>
                    </div>
                    <div className="w-full flex-grow flex">
                        <div className="w-[75%] h-full border border-neutral-200 rounded-md shadow-xl mr-4 flex items-center justify-center pr-9">
                            <LineChartVisualization />
                        </div>
                        <div className="w-[25%] relative">
                            <div className="h-full mb-4 w-full border border-neutral-200 shadow-lg rounded-md flex flex-col items-center justify-center overflow-hidden">
                                <PieChartVisualization />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    </>);
}

interface LayoutProps {
    children: React.ReactNode | React.ReactNode[]
}

export const Layout = ({ children }: LayoutProps) => {
    return (<>
        <Head>
            <title>FishFinder</title>
        </Head>
        <div className="flex min-h-screen">
            <nav className="w-12 shadow-xl flex flex-col items-center pt-8">
                <img src="/icons/logo.svg" alt="" className="mb-24" />
                <div>
                    <ActionIcon src="/icons/dashboard.svg" url="/" />
                    <ActionIcon src="/icons/review.svg" url="/review" />
                    <ActionIcon src="/icons/list.svg" url="/list" />
                </div>
            </nav>
            <main className="px-8 py-8 flex flex-col flex-grow w-[calc(100vw-64px)]">
                {children}
            </main>
        </div>
    </>)
}

interface ActionIconProps {
    src: string
    url?: string
}

const ActionIcon = ({ src, url }: ActionIconProps) => {
    return (<>
        <Link href={url as string}>
            <img src={src} className="m-1 p-2 rounded-md aspect-square hover:bg-neutral-100 cursor-pointer" />
        </Link>
    </>)
}

interface ModalProps {
    setShowModal: React.Dispatch<boolean>
    setModalValue: React.Dispatch<string>
    modalValue: string
}

const Modal = ({ setShowModal, setModalValue, modalValue }: ModalProps) => {

    const handleModalClick = (value: string) => {
        setModalValue(value)
        setShowModal(false)
    }

    const inputRef = React.useRef<HTMLInputElement>(null)

    return <div className="absolute top-0 left-0 w-screen h-screen z-10 flex flex-col items-center justify-center bg-neutral-500 bg-opacity-50">
        <div className="flex flex-col w-[25vw] bg-white border border-neutral-400 px-4 py-6 rounded-md">
            <div>
                <div>
                    URL Scan
                </div>
                <input ref={inputRef} placeholder="Provide your URL here" className="border border-neutral-600 w-full px-4 py-2" type="url" />
                <div>
                    <button onClick={e => setShowModal(false)} className=" ml-auto">Cancel</button>
                    <button onClick={e => handleModalClick(inputRef.current!.value)}>Submit</button>
                </div>
            </div>
        </div>

    </div>
}

const LineChartVisualization = () => {
    const data = [
        { name: '16-9-23', PhishingDomains: 400, pv: 2400, amt: 2400 }, 
        { name: '17-9-23', PhishingDomains: 500, pv: 2400, amt: 2400 }, 
        { name: '18-9-23', PhishingDomains: 300, pv: 2400, amt: 2400 }, 
        { name: '19-9-23', PhishingDomains: 700, pv: 2400, amt: 2400 },
        { name: '20-9-23', PhishingDomains: 800, pv: 2400, amt: 2400 },
        { name: 'Yesterday', PhishingDomains: 750, pv: 2400, amt: 2400 },
        { name: 'Today', PhishingDomains: 720, pv: 2400, amt: 2400 },
    ]
    return <LineChart width={1000} height={300} data={data}>
        <Line type="monotone" dataKey="PhishingDomains" stroke="#8884d8" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
    </LineChart>
}

const PieChartVisualization = () => {
    const data = [
        { name: 'discord.com', value: 400, color: "#8884d8" }, 
        { name: 'steamcommunity.com', value: 600, color: "#82ca9d" }, 
    ]
    const [isClient, setIsClient] = useState(false)
 
    React.useEffect(() => {
        setIsClient(true)
    }, [])

    return <>
        {
            isClient ? <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)
                    }
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart> : null
        }    
    </> 
    
    
}