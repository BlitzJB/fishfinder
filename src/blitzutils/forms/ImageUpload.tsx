import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import React, { ChangeEvent, useState } from "react"
import { FaRegImage } from "react-icons/fa6"
import { Label } from "./Label"
import { BaseUseStateOptions } from "./utils"

interface ImageUploadState {
    value: string
    setValue: React.Dispatch<string>
    status: "untouched" | "uploading" | "success" | "error"
    _private_setStatus: React.Dispatch<"untouched" | "uploading" | "success" | "error">
}

interface ImageUploadProps {
    state: ImageUploadState
    label?: string
}

const ImageUpload: React.FC<ImageUploadProps> = ({ state, label }) => {
    const { value, setValue, status, _private_setStatus } = state
    const [fileName, setFileName] = useState<string>("")
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fetchUrl = "/api/imageupload"
        
        const input = e.target as HTMLInputElement
        const file = input.files![0]
        if (!file) return
        setFileName(file.name)
        
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const result = reader.result
            if (typeof result != 'string') return
            
            const base64 = result.split(",")[1]
            
            _private_setStatus("uploading")
            fetch(fetchUrl, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 })
            }).then(res => {
                if (res.status === 413) {
                    alert("File too large") // need to replace with proper interface
                    _private_setStatus("error")
                }
                return res.json()
            }).then(data => {
                setValue(data.data.link)
                _private_setStatus("success")
            })
        }
    }
    
    return <div>
        {
            label && <Label label={label} />
        }
        <div onClick={e => { if (status === "uploading") { return }; fileInputRef.current?.click() }} className={`flex items-center py-3 px-4 border border-black rounded-sm ${ status === "uploading" ? "opacity-50" : "cursor-pointer" }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" fill="none">
                <g id="Iconsax/Linear/image"><path id="Vector" d="M11.7551 9.20389L10.4833 6.23352C10.0526 5.22579 9.26018 5.18516 8.72787 6.14413L7.95989 7.52976C7.5698 8.23273 6.84244 8.29368 6.33858 7.66385L6.24918 7.55007C5.725 6.8918 4.98546 6.97307 4.60756 7.7248L3.90865 9.12668C3.41698 10.1019 4.12808 11.2519 5.21707 11.2519H10.402C11.4585 11.2519 12.1696 10.175 11.7551 9.20389ZM5.77783 5.56306C6.10113 5.56306 6.4112 5.43462 6.63981 5.20601C6.86842 4.9774 6.99686 4.66733 6.99686 4.34403C6.99686 4.02072 6.86842 3.71066 6.63981 3.48205C6.4112 3.25343 6.10113 3.125 5.77783 3.125C5.45452 3.125 5.14446 3.25343 4.91584 3.48205C4.68723 3.71066 4.5588 4.02072 4.5588 4.34403C4.5588 4.66733 4.68723 4.9774 4.91584 5.20601C5.14446 5.43462 5.45452 5.56306 5.77783 5.56306Z" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"/><rect x="0.6" y="0.6" width="13.8" height="13.8" rx="3.15" stroke="#737373" stroke-width="1.2"/></g>
            </svg>
            <span className="ml-3">
                {
                    status === "untouched" ? 
                    "Upload an Image (.jpg, .png)" :
                    status === "error" ? 
                    "Something went wrong. Try again" : 
                    status === "success" ? 
                    `Uploaded ${fileName}! Change` :
                    status === "uploading" ?
                    "Uploading" :
                    "State error"
                }
            </span>
            {
                status === "uploading" && 
                <div aria-roledescription="spinner" className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin ml-auto"></div>
            }
        </div>
        <input ref={fileInputRef} className="hidden" type="file" accept=".jpg,.png" onChange={handleFileChange} />
    </div>
}

const useImageUploadState = (options?: BaseUseStateOptions): ImageUploadState => {
    const prefillValue = options && options.prefill ? options.prefill : "";
    const [value, setValue] = useState<string>(prefillValue);
    const [status, _private_setStatus] = useState<"untouched" | "uploading" | "success" | "error">("untouched")
    return { value, setValue, status, _private_setStatus }
}


const makeImageUploadHandler = (imgurClientId: string): NextApiHandler => {
    const uploadImage = async (image: string) => {
        const headers = new Headers()
        headers.append("Authorization", `Client-ID ${imgurClientId}`)
    
        const formdata = new FormData()
        formdata.append("image", image)
    
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: formdata,
        }
    
        const response = await fetch("https://api.imgur.com/3/image", requestOptions)
        const result = await response.json()
        return result
    }

    return async (req: NextApiRequest, res: NextApiResponse) => {
        try {
            res.status(200).json(await uploadImage(req.body.image))
        } catch (error) {
            res.status(500).json(error)
        }
    }
} 

const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb' 
        }
    }
}

export { ImageUpload, useImageUploadState, makeImageUploadHandler, config }