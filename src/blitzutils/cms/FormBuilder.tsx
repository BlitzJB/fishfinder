import { DecoratedProcedureRecord } from "@trpc/react-query/shared"
import { ImageUpload, useImageUploadState } from "../forms/ImageUpload"
import { Input, useCheckboxInputState, useNumericInputState, useTextInputState } from "../forms/Input"
import { Select, useSingleSelectState } from "../forms/Select"
import { Types } from "./types"
import { BuildProcedure } from "@trpc/server"
import { useRouter } from "next/router"
import { useEffect } from "react"

interface FormBuilderProps {
    model: {
        [key: string]: Types
    }
    currentId?: string
    procedures: DecoratedProcedureRecord<{
        create: BuildProcedure<"mutation", any, any>,
        update: BuildProcedure<"mutation", any, any>,
        delete: BuildProcedure<"mutation", any, any>,
    }, any>
    type: "create" | "update"
    name: string
    prefill?: any
}

interface Field {
    element: React.ReactNode
    state?: any
    payloadKey?: string
}

const FormBuilder: React.FC<FormBuilderProps> = ({ model, currentId, procedures, type, prefill, name }) => {
    if (type === "create") {
        return <CreateFormBuilder model={model} procedures={procedures} name={name} />
    }
    if (type === "update") {
        return <UpdateFormBuilder model={model} procedures={procedures} name={name} currentId={currentId} prefill={prefill} />
    }
}

const buildFields = (model: { [key: string]: Types }): Field[] => {
    
    const fields = Object.keys(model).map(key => {
        const field = model[key]!.serialize()
        if (field.private) {
            return null
        }
        if (field.type == "string") {
            const textInput = useTextInputState()
            return {
                element: <Input type="text" state={textInput} label={field.label} />,
                state: textInput,
                payloadKey: key
            }
        } else if (field.type === "image") {
            const imageInput = useImageUploadState()
            return {
                element: <ImageUpload state={imageInput} label={field.label} />,
                state: imageInput,
                payloadKey: key
            }
        } else if (field.type === "singleselect") {
            const selectInput = useSingleSelectState()
            return {
                element: <Select dataQuery={field.query!(undefined)} selector={field.nameSelector!} state={selectInput} label={field.label} multiple={false} />,
                state: selectInput,
                payloadKey: key
            }
        } else if (field.type === "number") {
            const numbericInput = useNumericInputState()
            return {
                element: <Input type="number" state={numbericInput} label={field.label} />,
                state: numbericInput,
                payloadKey: key
            }
        } else if (field.type === "checkbox") {
            const checkboxInput = useCheckboxInputState()
            return {
                element: <Input type="checkbox" state={checkboxInput} label={field.label} />,
                state: checkboxInput,
                payloadKey: key
            }
        } else {
            throw Error("unknown field type " + field.type)
        }
    })
    const nonPrivateFields = fields.filter(fields => fields !== null) as Field[]
    return nonPrivateFields
}

interface CreateFormBuilderProps {
    model: {
        [key: string]: Types
    }
    procedures: DecoratedProcedureRecord<{
        create: BuildProcedure<"mutation", any, any>,
    }, any>
    name: string
}

const CreateFormBuilder: React.FC<CreateFormBuilderProps> = ({ model, procedures, name }) => {
    const createMutation = procedures.create.useMutation()
    const router = useRouter()

    const fields = buildFields(model)

    const handleCreate = () => {
        const payload: Record<string, any> = {}
        fields.forEach(field => {
            payload[field.payloadKey!] = field.state.value
        })
        createMutation.mutate(payload, { onSuccess: () => router.back() })
    }

    const elements = fields.map(field => field.element)

    return (<>
        <div className="max-w-[800px] md:mx-auto mx-5">
            <div className="md:mx-auto mx-5 mt-3 text-lg font-bold">Create new {name}</div>
            { elements }
            <button onClick={handleCreate} className="bg-green-200 border-green-500 px-4 py-2 border-2 rounded-sm font-medium mt-2">
                {
                    createMutation.isLoading ? `Creating...` : 
                    createMutation.isSuccess ? "Successfully Created" : 
                    createMutation.isError ? "Something went wrong" : 
                    "Create"
                }
            </button>
        </div>
    </>)
}


interface UpdateFormBuilderProps {
    model: {
        [key: string]: Types
    }
    procedures: DecoratedProcedureRecord<{
        update: BuildProcedure<"mutation", any, any>,
    }, any>
    currentId?: string
    prefill?: any
    name: string
}


const UpdateFormBuilder: React.FC<UpdateFormBuilderProps> = ({ model, procedures, currentId, prefill, name }) => {
    const updateMutation = procedures.update.useMutation()
    const router = useRouter()

    const fields = buildFields(model)

    const handleUpdate = () => {
        const payload: Record<string, any> = {}
        fields.forEach(field => {
            payload[field.payloadKey!] = field.state.value
        })
        payload.id = currentId
        console.log(payload)
        updateMutation.mutate(payload, { onSuccess: () => router.back() })
    }

    useEffect(() => {
        if (prefill) {
            fields.forEach(field => {
                if (prefill.hasOwnProperty(field.payloadKey)) {
                    console.log(prefill)
                    field.state.setValue(prefill[field.payloadKey!])
                }
            })
        }
    }, [prefill])

    const elements = fields.map(field => field.element)

    return (<>
        <div className="max-w-[800px] md:mx-auto mx-5">
            <div className="md:mx-auto w- mx-5 mt-3 text-lg font-bold">Update {name}</div>
            { elements }
            <button onClick={handleUpdate} className="bg-yellow-100 border-yellow-300 px-4 py-2 border-2 rounded-sm font-medium mt-2">
                {
                    updateMutation.isLoading ? `Updating...` : 
                    updateMutation.isSuccess ? "Successfully Updated" : 
                    updateMutation.isError ? "Something went wrong" : 
                    "Update"
                }
            </button>
        </div>
    </>)
}




export { FormBuilder }