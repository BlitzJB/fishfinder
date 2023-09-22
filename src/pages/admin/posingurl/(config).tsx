import { api } from "~/utils/api"
import { TableColumn } from "react-data-table-component"
import { Actions } from "~/blitzutils/cms/elements"
import { Types } from "~/blitzutils/cms/types"
import Image from "next/image"
import { PosingUrl } from "@prisma/client"

/* 
model PosingUrl {
    id       String   @id @default(uuid())
    url      String
    originalUrl String
    reviewed Boolean @default(false) // Set to true if the URL doesnt need to be reviewed by human
    manualReviewResult String?
    manualReviewComment String?
    userSubmitted Boolean @default(false)
    
    regex   String
    jaro    String
    levenshtein String
    suspeciousSSL String
    suspeciousIPRange String
    imageComparison String
    // ... Any other URL metrics can be added here

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
*/


export const procedures = api.posingurl
export const name = "PosingUrl"
export const table: TableColumn<PosingUrl>[] = [
    {
        name: "URL",
        selector: row => row.url,
    }, 
    {
        name: "Original URL",
        selector: row => row.originalUrl,
    }, 
    {
        name: "Reviewed",
        selector: row => row.reviewed,
    }, 
    {
        name: "Manual Review Result",
        selector: row => row.manualReviewResult?.toString() ?? "",
    }, 
    {
        name: "Manual Review Comment",
        selector: row => row.manualReviewComment?.toString() ?? "",
    }, 
    {
        name: "User Submitted",
        selector: row => row.userSubmitted,
    }, 
    {
        name: "Regex",
        selector: row => row.regex,
    }, 
    {
        name: "Jaro",
        selector: row => row.jaro,
    }, 
    {
        name: "Levenshtein",
        selector: row => row.levenshtein,
    }, 
    {
        name: "Suspecious SSL",
        selector: row => row.suspeciousSSL,
    }, 
    {
        name: "Suspecious IP Range",
        selector: row => row.suspeciousIPRange,
    }, 
    {
        name: "Image Comparison",
        selector: row => row.imageComparison,
    }, 
    {
        name: "Actions",
        cell: row => <Actions row={row} name={name} />
    }
]

export const model = {
    id: new Types().string().identifier().private(),
    url: new Types().string().label("URL"),
    originalUrl: new Types().string().label("Original URL"),
    reviewed: new Types().checkbox().label("Reviewed"),
    manualReviewResult: new Types().string().label("Manual Review Result"),
    manualReviewComment: new Types().string().label("Manual Review Comment"),
    userSubmitted: new Types().checkbox().label("User Submitted"),
    regex: new Types().string().label("Regex"),
    jaro: new Types().string().label("Jaro"),
    levenshtein: new Types().string().label("Levenshtein"),
    suspeciousSSL: new Types().string().label("Suspecious SSL"),
    suspeciousIPRange: new Types().string().label("Suspecious IP Range"),
    imageComparison: new Types().string().label("Image Comparison"),
    
/*     id: new Types().string().identifier().private(),
    groupName: new Types().string().label("Vehicle Group Name"),
    name: new Types().string().label("Vehicle Variant Name"),
    bodyType: new Types().singleSelect(api.constants.bodyTypes.useQuery, (row) => row.name).label("Body Type"),
    brand: new Types().singleSelect(api.constants.vehicleBrands.useQuery, (row) => row.name).label("Brand"),
    tyreType: new Types().singleSelect(api.constants.tyreTypes.useQuery, (row) => row.name).label("Tyre Type (Tube, Tubeless)"),
    category: new Types().singleSelect(api.constants.categories.useQuery, (row) => row.en_name).label("Vehicle Category"),
    image: new Types().image().label("Vehicle Image"),
    frontSizeId: new Types().singleSelect(api.size.read.useQuery, row => row.name).label("Front Size"),
    rearSizeId: new Types().singleSelect(api.size.read.useQuery, row => row.name).label("Rear Size") */
}

export default () => {return <></>}

// TODO: generate table from model