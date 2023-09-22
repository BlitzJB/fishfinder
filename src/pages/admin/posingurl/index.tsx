import { name, procedures, table } from "./(config)"
import { api } from "~/utils/api"
import { ScreenLoader } from "~/blitzutils/loaders/ScreenLoader"
import DataTable from "react-data-table-component"
import { useRouter } from "next/router"

import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
/* export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    console.log(session)

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }


    if (session.user.email !== "kaverytyres.contact@gmail.com") {
        return {
            redirect: {
                permanent: false,
                destination: "/notadmin"
            }
        }
    }

    return {
        props: {}
    }
} */

const Browser = () => {
    const readQuery = procedures.read.useQuery(undefined, { initialData: [], refetchOnMount: true, refetchOnReconnect: true, refetchOnWindowFocus: true })
    const router = useRouter()
    const [searchString, setSearchString] = useState("")

    useEffect(() => {

    })

    if (!readQuery.isFetched) return <ScreenLoader />

    const getSearchString = (data: any) => {
        return `${data.name} ${data.brand} ${data.bodyType} ${data.category}`
    }

    const filterData = (data: any[]) => {
        let out = [...data]
        if (searchString) {
            out = out.filter(p => getSearchString(p).toLowerCase().includes(searchString.toLowerCase()))
        }
        return out
    }

    return <>
        <div className="mx-8">
            <div className="flex mt-5 mb-2 items-center">
                <div className="text-lg font-bold">All {name}</div>
                <input placeholder="Search vehicle" className="px-4 py-2 border border-neutral-700 min-w-24 mr-2 rounded-sm ml-auto" type="text" value={searchString} onChange={e => setSearchString(e.target.value)} />
                <button onClick={e => router.push(`${name.replaceAll(' ', '-').toLowerCase()}/create`)} className="px-3 py-2 bg-green-200 border-2 border-green-500 rounded-sm font-medium">Create {name} +</button>
            </div>
            <DataTable columns={table} data={filterData(readQuery.data)} defaultSortFieldId={1} pagination/>
        </div>
    </>
}

export default Browser