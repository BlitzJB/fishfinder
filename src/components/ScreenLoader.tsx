import React from "react"

interface DependentScreenLoaderProps {
    conditionsArr: boolean[]
}

const DependentScreenLoader: React.FC<DependentScreenLoaderProps> = ({ conditionsArr }) => {
    if (conditionsArr.reduce((a, b) => a && b)) return <></>
    return <ScreenLoader />
}

const ScreenLoader: React.FC = () => {
    return (
        <div className="absolute flex top-0 left-0 min-h-screen min-w-full items-center justify-center z-50 bg-white">
            <div style={{ animationDuration: '400ms' }} className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}

export { ScreenLoader, DependentScreenLoader }