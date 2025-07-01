import Box from "@mui/material/Box"
import FormControl from "@mui/material/FormControl"
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { add_to_prefix_list, update_ABox, update_dataset_list, update_TBox } from "@/lib/redux/action"
import { Typography } from "@mui/material"
import CircularProgress from '@mui/material/CircularProgress';
import { splitIRI } from "@/lib/custom/helper"

const FileListTab = ({}) => {

    const dispatch = useDispatch();

    const tbox = useSelector((state) => state.datasetReducer.tbox);
    const abox = useSelector((state) => state.datasetReducer.abox);
    const prefixes = useSelector((state) => state.datasetReducer.prefixes);
    const selectedLevels = useSelector((state) => state.queryReducer.selectedLevels);

    const [graphs, setGraphs] = useState([])
    const [loading, setLoading ] = useState(false)
    
    const getGraphList = async () => {
        const res = await fetch('/api/get_graph_list', {method: "POST"})
        if(res){
            const data = await res.json()
            const graphNames = data.graphNames
            setGraphs(graphNames)
        }
        else{
            console.log("couldn't fetch the graphs...")
        }
    }

    const getDatasetList = async()=>{
        setLoading(true)
        const res = await fetch('/api/get_dataset_list', {
            method: "POST",
            body:JSON.stringify({tbox:tbox})}
        )
        if(res){
            const data = await res.json()
            var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
            const tempDatasetList = []
            let datasetID = '';
            data.datasetList.forEach(prefix=>{
                prefix = splitIRI(prefix)
                if(prefix[0] in tempPrefixes !== true){

                    tempPrefixes[prefix[0]] =  "prefix"+datasetID;
                    tempPrefixes["prefix"+datasetID] =  prefix[0];
                    
                    tempDatasetList.push("prefix"+datasetID+":"+prefix[1]);
                    if(datasetID === '') datasetID = 1;
                    else datasetID++;
                }
                else{
                    tempDatasetList.push(tempPrefixes[prefix[0]]+":"+prefix[1]);
                }
            })
            dispatch(update_dataset_list(tempDatasetList))
            dispatch(add_to_prefix_list(tempPrefixes))
        }
        else{
            console.log("couldn't fetch the dataset list...")
        }
        setLoading(false)
    }

    useEffect(() => {
        getGraphList();
    }, [])
    

    return (
        <Box className="flex justify-center flex-col flex-wrap gap-3 mt-2">
            <FormControl fullWidth>
                <InputLabel id='tbox-select'>TBox IRI</InputLabel>
                <Select
                    labelId="tbox-select"
                    label='TBox IRI'
                    value={tbox}
                    onChange={(e)=>dispatch(update_TBox(e.target.value))}
                    defaultValue=''>
                    {graphs.map((item, idx) => (
                        <MenuItem key={`tbox_${idx}`} value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel id='abox-select'>ABox IRI</InputLabel>
                <Select
                    labelId="abox-select"
                    label='ABox IRI'
                    value={abox}
                    onChange={(e)=>dispatch(update_ABox(e.target.value))}
                    defaultValue=''>
                    {graphs.map((item, idx) => (
                        <MenuItem key={`abox_${idx}`} value={item}>{item}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box hidden={tbox.length>0 && abox.length>0}>
                <Typography className="font-bold text-center text-xs" sx={{color:'#08094f'}}> 
                    Select a TBox and an ABox to extract dataset(s).
                </Typography>
            </Box>
            
            <Button sx={{backgroundColor:'#08094f'}} className="mb-4" fullWidth variant='contained' 
            onClick={() => getDatasetList()} type="button" 
            disabled={!tbox.length || !abox.length} >
                {loading? <CircularProgress size={25} color="inherit"/>:"Extract Datasets"}
            </Button>
        </Box>
    )
}

export default FileListTab