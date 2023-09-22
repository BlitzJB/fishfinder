import { useRouter } from "next/router"
import React from "react"
import DataTable, { TableColumn } from "react-data-table-component"

interface ViewerProps {
    name: string
    data: any[]
    table: TableColumn<any>[]
}

const Viewer: React.FC<ViewerProps> = ({ name, data, table }) => {

    const router = useRouter()

    return <>
        <div className="mx-8">
            <div className="flex mt-5 mb-2 items-center">
                <div className="text-lg font-bold">All {name}s</div>
                <button onClick={e => router.push(`${name.replaceAll(' ', '-').toLowerCase()}/create`)} className="px-3 py-2 bg-green-200 border-2 border-green-500 rounded-sm font-medium ml-auto">Create {name} +</button>
            </div>
            <DataTable columns={table} data={data} defaultSortFieldId={1} pagination/>
        </div>
    </>
}