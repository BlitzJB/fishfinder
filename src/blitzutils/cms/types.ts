import { DefinedUseQueryResult } from "@tanstack/react-query"
import { ProcedureUseQuery } from "@trpc/react-query/dist/createTRPCReact"
import { UseTRPCQueryResult } from "@trpc/react-query/shared"
import { BuildProcedure } from "@trpc/server"

interface SchemaField {
    type: "string" | "number" | "image" | "checkbox" | "singleselect" | "multiselect" | "text"
    isId: boolean
    private: boolean
    filterable?: "text" | "singleselect"
    label?: string
    query?: ProcedureUseQuery<BuildProcedure<"query", any, any>, any>
    nameSelector?: (row: any) => string 
}
  
class Types {
    private schema: SchemaField

    constructor() {
        this.schema = {
            type: "string",
            isId: false,
            private: false,
        }
    }

    string(): this {
        this.schema.type = "string"
        return this
    }

    number(): this {
        this.schema.type = "number"
        return this
    }

    image(): this {
        this.schema.type = "image"
        return this
    }

    checkbox(): this {
        this.schema.type = "checkbox"
        return this
    }

    singleSelect(query: ProcedureUseQuery<BuildProcedure<"query", any, any>, any>, nameSelector: (row: any) => string): this {
        this.schema.type = "singleselect"
        this.schema.query = query
        this.schema.nameSelector = nameSelector
        return this
    }

    multiSelect(query: ProcedureUseQuery<BuildProcedure<"query", any, any>, any>, nameSelector: (row: any) => string): this {
        this.schema.type = "multiselect"
        this.schema.query = query
        this.schema.nameSelector = nameSelector
        return this
    }

    identifier(): this {
        this.schema.isId = true
        return this
    }

    private(): this {
        this.schema.private = true
        return this
    }

    filterable(type: "text" | "singleselect"): this {
        return this
    }

    label(label: string): this {
        this.schema.label = label
        return this
    }

    serialize(): SchemaField {
        return this.schema
    }
}


export { Types }