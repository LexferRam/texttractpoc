import React from 'react'

const QueryResultDisplay = ({
    result
}: any) => {
    return (
        <>
            {result && result.length > 0 ? (
                <div className="grid-container">
                    {result.map((res: any, index: any) => {
                        return (
                            <div
                                key={`data-doc-${index}`}
                                style={{
                                    height: "auto",
                                    padding: "15px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "10px",
                                    maxWidth: "300px",
                                }}
                            >
                                <h4 style={{ textAlign: "center", flex: 1 }}>{res.key}</h4>
                                <p style={{ textAlign: "center" }}>{res.value}</p>
                            </div>
                        );
                    })}
                </div>
            ) : null}</>
    )
}

export default QueryResultDisplay