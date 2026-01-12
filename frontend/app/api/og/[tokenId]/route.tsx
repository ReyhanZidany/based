import { ImageResponse } from "next/og";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { BASED_CONTRACT } from "@/lib/contract";
import { BASED_ABI } from "@/lib/abi";

export const runtime = "edge";

const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
});

export async function GET(
    _: Request,
    { params }: { params: Promise<{ tokenId: string }> }
) {
    try {
        const { tokenId } = await params;

        // Fetch Proof Data from Contract
        const proof = (await client.readContract({
            address: BASED_CONTRACT as `0x${string}`,
            abi: BASED_ABI,
            functionName: "getProofDetails",
            args: [BigInt(tokenId)],
        })) as unknown as {
            timestamp: bigint;
            role: string;
            projectName: string;
            issuer: string;
        };

        const date = new Date(Number(proof.timestamp) * 1000).toLocaleDateString(
            "id-ID",
            { day: "numeric", month: "long", year: "numeric" }
        );

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        border: "20px solid black",
                        padding: "60px",
                        fontFamily: "monospace",
                    }}
                >
                    {/* Branding */}
                    <div
                        style={{
                            display: "flex",
                            marginBottom: "40px",
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "black",
                                color: "white",
                                padding: "10px 30px",
                                fontSize: "24px",
                                fontWeight: 900,
                                letterSpacing: "4px",
                            }}
                        >
                            BASED.ID
                        </div>
                    </div>

                    {/* Header */}
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
                        <div style={{ fontSize: "60px", fontWeight: 900, textTransform: "uppercase", lineHeight: 1 }}>
                            Proof
                        </div>
                        <div style={{ fontSize: "60px", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, color: "#0052FF" }}>
                            Of Contribution
                        </div>
                        <div style={{ fontSize: "24px", color: "gray", marginTop: "10px" }}>
                            RECORD_ID: #{tokenId}
                        </div>
                    </div>

                    {/* Role */}
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: "40px" }}>
                        <div style={{ fontSize: "20px", color: "gray", marginBottom: "10px" }}>-- HOLDER_ROLE</div>
                        <div style={{ fontSize: "70px", fontWeight: 900, color: "#0052FF", textTransform: "uppercase" }}>
                            {proof.role}
                        </div>
                    </div>

                    {/* Project */}
                    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <div style={{ fontSize: "20px", color: "gray", marginBottom: "10px" }}>-- PROJECT_SCOPE</div>
                        <div style={{ fontSize: "50px", fontWeight: 900, color: "black" }}>
                            {proof.projectName}
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                            borderTop: "4px solid black",
                            paddingTop: "30px",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", fontSize: "20px" }}>
                            <span style={{ fontWeight: "bold", width: "150px" }}>ISSUER:</span>
                            <span style={{ fontFamily: "monospace", backgroundColor: "#f3f4f6", padding: "0 10px" }}>
                                {proof.issuer}
                            </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", fontSize: "20px" }}>
                            <span style={{ fontWeight: "bold", width: "150px" }}>DATE:</span>
                            <span>{date}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", fontSize: "20px" }}>
                            <span style={{ fontWeight: "bold", width: "150px" }}>NETWORK:</span>
                            <span style={{ color: "#0052FF", fontWeight: "bold" }}>BASE SEPOLIA</span>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: unknown) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        fontSize: "40px",
                        fontWeight: "bold",
                    }}
                >
                    Failed to load proof
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    }
}
