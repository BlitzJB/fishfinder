import { ProcedureUseQuery } from "@trpc/react-query/dist/createTRPCReact"
import { BuildProcedure } from "@trpc/server"
import { ScreenLoader } from "../loaders/ScreenLoader"
import { ElementType, useState } from "react"


interface ModalSelectProps {
    name: string
    query: ProcedureUseQuery<BuildProcedure<"query", any, any>, any>
    Element: ElementType
    state: ModalSelectState
}

const ModalSelect: React.FC<ModalSelectProps> = ({ name, query, Element, state }) => {
    const queryResult = query(undefined)
    if (!queryResult.isFetched) return <ScreenLoader />
    if (!state.show) return <></>
    return <>
        <div className="absolute top-0 left-0 min-h-screen h-full w-[100vw] z-50 bg-white px-5">
            <div className="mt-5 cursor-pointer" onClick={e => state.hideModal()}><u>Back</u></div>
            <div className="mt-5">Select {name}</div>
            <div className="flex flex-wrap mt-5">
                {
                    queryResult.data.map((el: any) => {
                        return <div className="w-[47%] mr-3 mb-5" onClick={e => { state.setValue(el.id); state._private_setStatus("success"); state.hideModal() }}>
                            <Element data={el} key={el.id} />
                        </div>
                    })
                }
            </div>
        </div>
    </>
}

interface ModalSelectState {
    value: string
    setValue: React.Dispatch<string>
    status: "untouched" | "success"
    _private_setStatus: React.Dispatch<"untouched" | "success">
    show: boolean
    setShow: React.Dispatch<boolean>
    showModal: () => void
    hideModal: () => void
}

const useModalSelectState = () => {
    const [value, setValue] = useState<string>("")
    const [status, _private_setStatus] = useState<"untouched" | "success">("untouched")
    const [show, setShow] = useState<boolean>(false)
    const showModal = () => { setShow(true) }
    const hideModal = () => { setShow(false) }
    return { value, setValue, status, _private_setStatus, show, setShow, showModal, hideModal }
}

export { ModalSelect, useModalSelectState }