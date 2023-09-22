import { name, table, procedures } from "../(config)"
import { useRouter } from "next/router"
import { ScreenLoader } from "~/blitzutils/loaders/ScreenLoader"
import DataTable from "react-data-table-component"

import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
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
}
 */
const Delete = () => {
    const router = useRouter()

    const { id } = router.query
    if (!id) return <>Invalid ID</>
    
    const readOneQuery = procedures.readOne.useQuery({ id: id as string })
    const deleteMutation = procedures.delete.useMutation()

    if (!readOneQuery.isFetched) return <ScreenLoader />
    if (readOneQuery.isError) return <>Something went wrong fetching data. check internet connection</>

    const handleDelete = () => {
        deleteMutation.mutate({ id: id as string }, { onSuccess: () => router.back() })
    }

    return (<>
        Are you sure you want to delete this {name}?
        <DataTable columns={table.filter(col => col.name !== 'Actions')} data={[readOneQuery.data!]} />
        <button onClick={handleDelete}>
            {
                deleteMutation.isLoading ? "Deleting..." :
                deleteMutation.isSuccess ? "Successfully Deleted" :
                deleteMutation.isError ? "Something went wrong" :
                "Confirm Delete"
            }
        </button>
    </>)
}

export default Delete