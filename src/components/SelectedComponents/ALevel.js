import Card from '@mui/material/Card'
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { remove_level } from '@/lib/redux/action';

export default function ALevel({info}) {
    
    const dispatch = useDispatch()

    const [selectedAttribute, setselectedAttribute] = useState('')
    const [attributeValues, setAttributeValues] = useState([])

    useEffect(() => {
        if(selectedAttribute.length>0){
            info.selectedInstances.forEach(attr => {
                if(attr.prefixIRI === selectedAttribute){
                    setAttributeValues(attr.instances)
                }
            })
        }
    }, [selectedAttribute])

    useEffect(() => {
        if(info.selectedInstances.length>0 && selectedAttribute===''){
            setselectedAttribute(info.selectedInstances[0].prefixIRI)
        }
        if(info.selectedInstances.length>0 && selectedAttribute.length>0){
            info.selectedInstances.forEach(attr => {
                if(attr.prefixIRI === selectedAttribute){
                    setAttributeValues(attr.instances)
                }
            })
        }
        if(info.selectedInstances.length == 0) setselectedAttribute('')
    }, [info])
    
    

    return (
        <Card className="w-full border-2 rounded p-2 overflow-y-auto mt-2">
             <Box className="w-full flex justify-center">
                
                <Box className="w-11/12 flex items-center">
                    <Typography  className="p-0 ml-1 text-sm font-semibold" sx={{color:'#08094f'}}>{info.prefixName}</Typography>
                </Box>
                
                <Box className="w-1/11 flex justify-start">      
                    <Button onClick={()=>{dispatch(remove_level(info.levelName))}} className="w-full h-10 rounded">
                        <DeleteIcon className="text-red-600"/>
                    </Button>
                </Box>
            </Box>
            <Box className="w-full" >
                {/* Attributes of Filtering Instances */}
                {
                    info.selectedInstances.length>0 &&
                        <select value={selectedAttribute} onChange={(e)=>{setselectedAttribute(e.target.value)}} className="w-full mb-2 border border-slate-500 rounded mt-2 text-sm p-1">
                            {
                                info.selectedInstances.map((a)=>(
                                    <option key={a.prefixIRI} value={a.prefixIRI}>{a.prefixIRI}</option>
                                ))
                            }
                        </select>
                }
                {/* info.selectedInstances[0].prefixIRI */}
                

                <Box sx={{maxHeight:'25vh'}} className="w-full pb-3 overflow-auto">
                    {/* Filtering Values of the corresponding Attribute */}
                    {
                        info.selectedInstances.length>0 && selectedAttribute.length > 0 && attributeValues.length>0 &&
                                attributeValues.map((instance,id) => (
                                    <Typography key={id} className="pl-3 pt-1 text-sm">
                                    <RadioButtonCheckedIcon className="mr-1 text-sm" />
                                    {instance.value}
                                    </Typography>
                              ))
                    }
                    {
                        // attributeValues.length > 0 && 
                    }
                </Box>

            </Box>
            
        </Card>
    )
}
