import CardContent from "@mui/material/CardContent"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import AttributeListTab from "./Sections/AttributeListTab"


const Viewport2 = ({}) => {

    

    return (
        <Card className='w-4/12 flex-1'>
            <CardHeader title='Instance Filtering' className="py-3" sx={{color:'#08094f'}}/>
            <CardContent sx={{maxHeight:'110vh'}}  className={"flex justify-center flex-wrap flex-row w-full overflow-y-auto py-0"}>
                <AttributeListTab/>
            </CardContent>
        </Card>
        
    )
}


export default Viewport2