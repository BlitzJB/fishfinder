import React from "react"

interface StaticProps {
    dataQuery: any
    selector: (row: any) => string
}


export const Static: React.FC<StaticProps> = ({ dataQuery, selector }) => {

    return <div>{ selector(dataQuery.data) }</div>
}