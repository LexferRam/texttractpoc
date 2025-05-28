import React from 'react'
// AWS SDK ------------------------------
import {
    TextractClient,
    AnalyzeDocumentCommand,
    AnalyzeDocumentCommandInput,
    AnalyzeDocumentCommandOutput,
} from "@aws-sdk/client-textract";
import getDocumentQueries from "@/app/_utils/getDocumentQueries";

const useTextractAnalizedImage = ({
    setLoading,
    setResult,
    setShowCameraPreview
}: any) => {

    const client = new TextractClient({
        region: "us-east-1",
        credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY || "",
            secretAccessKey: process.env.NEXT_PUBLIC_SECRET || "",
        },
    });

    const isVenezuelanIdCard = (idCard: string) => {
        const regex = /^[V|E|J|P][0-9]{5,9}$/;
        return regex.test(idCard);
    };

    const analizeImage = async (file: any, docType: string) => {
        setLoading(true)

        const command = new AnalyzeDocumentCommand({
            // AnalyzeDocumentRequest
            Document: {
                // Document
                Bytes: file
                    ? new Uint8Array(file)
                    : undefined, // e.g. Buffer.from("") or new TextEncoder().encode("")
            },
            FeatureTypes: [
                // FeatureTypes // required
                "QUERIES",
            ],
            QueriesConfig: {
                // QueriesConfig
                Queries: getDocumentQueries(docType),
            },
        });
        const response: AnalyzeDocumentCommandOutput = await client.send(command);

        console.log(response)

        if (response) {
            const data: any = [];
            const blocks = response.Blocks;
            const lines = blocks?.filter((line) => line.BlockType === "LINE") ?? [];

            const cedIndex = lines?.findIndex((line) => {
                if (line?.Text) {
                    return isVenezuelanIdCard(line.Text);
                }
            });

            const queries = blocks
                ? blocks?.filter((query) => query.BlockType === "QUERY")
                : null;
            const queriesResult = blocks
                ? blocks?.filter((query) => query.BlockType === "QUERY_RESULT")
                : null;


            if (queries && queriesResult) {
                queries?.map((query) => {
                    let id =
                        query.Relationships && query.Relationships[0].Ids
                            ? query?.Relationships[0]?.Ids[0]
                            : null;
                    let found = queriesResult?.find((result) => result.Id === id);

                    if (found && query.Query?.Alias && found.Text) {
                        // generalConfidenceValues.push(found?.Confidence ?? 0);
                        data.push({
                            key: query?.Query?.Alias,
                            value: found?.Text,
                            confidence: found?.Confidence,
                        });
                    }
                });
            }
            setResult(data);
            setLoading(false)
            setShowCameraPreview(false)

        } else {
            console.error('ERROR ANALIZANDO CON TEXTRACT')
        }
    }
    
    return {
        analizeImage
    }
}

export default useTextractAnalizedImage