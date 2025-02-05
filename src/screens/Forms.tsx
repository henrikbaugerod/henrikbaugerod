import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { FormItemType } from "../types"

const Forms = () => {
    const formArray: FormItemType[] = [
        { title: "Form1", url: "form1", thumbnail: "" }
    ]

    return (
        <>
            <Header />
            <div className="homepage-wrapper">
                <div className="homepage-content">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6">
                                {formArray && formArray.map((item, index) => (
                                    <FormItem key={index} {...item} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const FormItem = (props: FormItemType) => {
    const { title, url, thumbnail } = props;
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${url}`)
    }

    return (
        <a href="#" onClick={handleClick}>
            <h3>{title}</h3>
        </a>
    )
}

export default Forms;