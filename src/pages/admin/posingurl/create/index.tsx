import { useRouter } from "next/router";
import React from "react";
import { Input, useTextInputState } from "~/blitzutils/forms/Input";
import { validate, clear } from "~/blitzutils/forms/utils";
import { model, name, procedures } from "../(config)";
import { FormBuilder } from "~/blitzutils/cms/FormBuilder";

import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
/* 
export const getServerSideProps: GetServerSideProps = async (context) => {
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

const Create = () => {
    return <> <FormBuilder model={model} procedures={procedures} type="create" name={name} /> </>
}

export default Create