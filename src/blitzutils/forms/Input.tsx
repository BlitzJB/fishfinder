import React, { useState } from "react"
import { Label } from "./Label"
import { type BaseUseStateOptions } from "./utils"

interface InputProps {
    type: "text" | "number" | "checkbox"
    state: TextInputState | NumbericInputState | CheckboxInputState
    label?: string
}

const Input: React.FC<InputProps> = ({ type, state, label }) => {
    // TODO: handle the whole state = state as XXXInputState more gracefully
    if (type == "text") return <TextInput state={state as TextInputState} label={label} />
    if (type == "number") return <NumericInput state={state as NumbericInputState} label={label} />
    if (type == "checkbox") return <CheckboxInput state={state as CheckboxInputState} label={label} />
}

type InputStatusStates = "untouched" | "success" | "validationFailed"

interface TextInputState {
    value: string
    setValue: React.Dispatch<string>
    status: InputStatusStates
    _private_setStatus: React.Dispatch<InputStatusStates>
    validate?: (value: string) => boolean
}

const TextInput: React.FC<{ state: TextInputState, label?: string }> = ({ state, label }) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        state.setValue(e.target.value)
        if (state.validate) {
            if (!state.validate(state.value))
                state._private_setStatus("validationFailed")
            else 
                state._private_setStatus("success")
        } else {
            state._private_setStatus("success")
        }
    }
    return <>
        {
            label && <Label label={label} />
        }
        <input type="text" value={state.value} onChange={onChange}  className="block w-full border border-neutral-700 mb-2 py-3 px-4"/>
    </>
}

const useTextInputState = (options?: BaseUseStateOptions) => {
    const prefillValue = options && options.prefill ? options.prefill : "";
    const [value, setValue] = useState<string>(prefillValue)
    const [status, _private_setStatus] = useState<InputStatusStates>("untouched")
    return { value, setValue, status, _private_setStatus }
}

interface NumbericInputState {
    value: number
    setValue: React.Dispatch<number>
    status: InputStatusStates
    _private_setStatus: React.Dispatch<InputStatusStates>
    validate?: (value: number) => boolean
}


const NumericInput: React.FC<{ state: NumbericInputState, label?: string }> = ({ state, label }) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        state.setValue(Number(e.target.value))
        if (state.validate) {
            if (!state.validate(state.value))
                state._private_setStatus("validationFailed")
            else 
                state._private_setStatus("success")
        } else {
            state._private_setStatus("success")
        }
    }
    return <>
        {
            label && <Label label={label} />
        }
        <input type="number" value={state.value} onChange={onChange}  className="block w-full border border-neutral-700 mb-2 py-3 px-4"/>
    </>
}

const useNumericInputState = (options?: BaseUseStateOptions) => {
    const prefillValue = options && options.prefill ? options.prefill : "";
    const [value, setValue] = useState<string>(prefillValue)
    const [status, _private_setStatus] = useState<InputStatusStates>("untouched")
    return { value, setValue, status, _private_setStatus }
}

interface CheckboxInputState {
    value: boolean
    setValue: React.Dispatch<boolean>
    status: InputStatusStates
    _private_setStatus: React.Dispatch<InputStatusStates>
    validate?: (value: boolean) => boolean
}

const CheckboxInput = ({ state, label }: { state: CheckboxInputState, label?: string }) => {
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        state.setValue(e.target.checked)
        if (state.validate) {
            if (!state.validate(state.value))
                state._private_setStatus("validationFailed")
            else
                state._private_setStatus("success")
        } else {
            state._private_setStatus("success")
        }
    }
    return <>
        {
            label && <Label label={label} />
        }
        <div className="flex items-center">
            <input type="checkbox" checked={state.value} onChange={onChange}  className="block border border-neutral-700"/>
            <div className="ml-1">{label}</div>
        </div>
    </>
}

const useCheckboxInputState = (options?: BaseUseStateOptions) => {
    const prefillValue = options && options.prefill ? options.prefill : false;
    const [value, setValue] = useState<boolean>(false)
    const [status, _private_setStatus] = useState<InputStatusStates>("untouched")
    return { value, setValue, status, _private_setStatus }
}

export { Input, useTextInputState, useNumericInputState, useCheckboxInputState }