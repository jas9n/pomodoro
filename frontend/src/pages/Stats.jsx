import Auth from "../components/Auth"

function Stats() {
    return (
        <div className="stats">
            <Auth>
                These are your analytics.
            </Auth>
            <Auth allowed>
                Analytics will be available when you are logged in.
            </Auth>
        </div>
    )
}

export default Stats