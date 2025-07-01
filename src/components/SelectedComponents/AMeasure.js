import Card from '@mui/material/Card'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useDispatch } from "react-redux";
import { remove_an_aggregate_function_from_a_measure, remove_measure_from_selected_measure_list } from '@/lib/redux/action';

export default function AMeasure({info}) {

    const dispatch = useDispatch()

    return (
        <Card className="w-full border-2 rounded p-2 overflow-y-auto mt-2">
            <Box className="w-full flex justify-center">
                
                <Box className="w-11/12 flex items-center">
                    <Typography  className="p-0 ml-1 text-sm font-semibold" sx={{color:'#08094f'}}>{info.measurePrefixName}</Typography>
                </Box>
                
                <Box className="w-1/11 flex justify-start">      
                    <Button onClick={()=>{dispatch(remove_measure_from_selected_measure_list(info.measureName))}} className="w-full h-10 rounded">
                        <DeleteIcon className="text-red-600"/>
                    </Button>
                </Box>
            </Box>
            <Box className="full mt-0 pt-0 pl-4 pr-10">
                {
                    info.aggFunctions.map((a)=> (
                        <Box  key={a.prefixName} className="flex p-1 rounded border-2 items-center justify-between">
                            <Typography className="text-sm" >
                                <RadioButtonCheckedIcon className="mr-1 text-sm" />
                                {a.prefixName}
                            </Typography>
                            <RemoveCircleOutlineIcon onClick={()=>{
                                dispatch(remove_an_aggregate_function_from_a_measure(a.aggFuncName,info.measureName))}} className="text-red-600 text-sm cursor-pointer h-full"/>
                        </Box>)
                    )
                }
            </Box>
            
        </Card>
    )
}
