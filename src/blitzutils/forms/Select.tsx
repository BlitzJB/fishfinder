import { UseTRPCQueryResult } from "@trpc/react-query/shared"
import React, { useState } from "react"
import { Label } from "./Label"
import { BaseUseStateOptions } from "./utils"

interface SelectProps {
    multiple?: boolean
    dataQuery: UseTRPCQueryResult<any, any>
    selector: (row: any) => string
    label?: string
    state: SingleSelectState
}

const Select: React.FC<SelectProps> = ({ multiple, dataQuery, selector, label, state }) => {
    if (multiple) return <MultiSelect />
    return <SingleSelect state={state as SingleSelectState} dataQuery={dataQuery} selector={selector} label={label} />
}


const useSingleSelectState = (options?: BaseUseStateOptions) => {
    const [value, setValue] = useState<string>("")
    const [status, _private_setStatus] = useState<"untouched" | "success" | "error" | "loading">("untouched")
    return { value, setValue, status, _private_setStatus }
} 


const MultiSelect = () => { return <></> }

interface SingleSelectState {
    value: string
    setValue: React.Dispatch<string>
    status: "untouched" | "success" | "error" | "loading"
    _private_setStatus: React.Dispatch<"untouched" | "success" | "error" | "loading">
}

interface SingleSelectProps {
    dataQuery: UseTRPCQueryResult<any, any>
    selector: (row: any) => string
    label?: string
    state: SingleSelectState
}

const SingleSelect: React.FC<SingleSelectProps> = ({ dataQuery, selector, label, state }) => {
    const { value, setValue, status, _private_setStatus } = state;
  
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setValue(selectedValue);
        _private_setStatus("success");
    };

    return <>
        { label && <Label label={label} /> }
        <select defaultValue="" value={value} onChange={handleSelectChange} className="w-full border border-neutral-700 h-12 rounded-sm pl-2">
            {status === "loading" ? (
                <option disabled>Loading...</option>
            ) : status === "error" ? (
                <option disabled>Error loading options</option>
            ) : (<>
                <option disabled value="">
                Select an option...
                </option>
                {
                    dataQuery.data?.map((row: any) => (
                        <option value={row.id} key={row.id}>
                            {selector(row)}
                        </option>
                    ))
                }
            </>)}
        </select>
    </>
}

export { Select, useSingleSelectState }