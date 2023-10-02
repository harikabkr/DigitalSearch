import { useParams } from "react-router-dom"
import { API_URI } from "../utils/constants"

export const QrCodeViewer = () => {
    const { id } = useParams();
    return (
    <div style={{ display: "flex", flexDirection: 'column', width: 500, justifyContent: 'center', margin: 'auto', paddingTop: '10%' }}>
        <img src={`${API_URI}/media/qrcode/${id}`} alt="qr-code for authenticator" />
    </div>
    );
}