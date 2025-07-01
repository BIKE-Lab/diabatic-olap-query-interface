import CardContent from "@mui/material/CardContent"
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography  from "@mui/material/Typography"
import AMeasure from "@/components/SelectedComponents/AMeasure"
import ALevel from "@/components/SelectedComponents/ALevel"
import SelectedLevels from "./Sections/LevelsTab/SelectedLevels"
import SelectedMeasures from "./Sections/MeasuresTab/SelectedMeasures"

export default function Viewport3() {
  return (
    <Card className='w-4/12 flex-1'>
        <CardHeader className="py-3" title='Selection Summary' sx={{color:'#08094f'}}/>
        <CardContent sx={{maxHeight:'110vh'}} className={"flex justify-center flex-wrap flex-row gap-2 w-full overflow-y-auto py-0"}>
          <SelectedMeasures/>
          <SelectedLevels/>
        </CardContent>
    </Card>
  )
}

