import { ScreenLoader } from "~/blitzutils/loaders/ScreenLoader"
import { model, name, procedures } from "../(config)"
import { useRouter } from "next/router"
import { useTextInputState } from "~/blitzutils/forms/Input"
import { name as modelName } from "../(config)"
import { Input } from "~/blitzutils/forms/Input"
import { useEffect, useState } from "react"
import { FormBuilder } from "~/blitzutils/cms/FormBuilder"

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
} */

const Update = () => {
    const router = useRouter()
    const { id } = router.query
    
    const readOneQuery = procedures.readOne.useQuery({ id: id as string }, { enabled: id !== undefined })
    
    if (!id) return <>Invalid ID</>
    if (readOneQuery.isLoading) return <ScreenLoader />
    if (readOneQuery.isError) return <>Something went wrong while fetching data</>

    return <>
        <FormBuilder type="update" model={model} procedures={procedures} currentId={id as string} prefill={readOneQuery.data} name={name} />
    </>
}

export default Update