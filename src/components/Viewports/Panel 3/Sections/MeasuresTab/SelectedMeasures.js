import CardContent from "@mui/material/CardContent"
import Card from '@mui/material/Card'
import Typography  from "@mui/material/Typography"
import AMeasure from "@/components/SelectedComponents/AMeasure"
import { useSelector } from "react-redux";

export default function SelectedMeasures() {

    const selected_measures = useSelector((state) => state.queryReducer.selectedMeasures);


    return (
        <Card className="w-full border-2 rounded p-2">
            <Typography className="p-0 pb-1 text-xl font-medium font-sans" sx={{color:'#08094f'}}>Measures</Typography>
            <CardContent className="w-full p-0 overflow-auto"  sx={{height:"35vh"}}>
                {
                    selected_measures.map((measure, index) => (
                        <AMeasure key={index} info={measure} />
                    ))
                }
            </CardContent>
        </Card>
    )
}
