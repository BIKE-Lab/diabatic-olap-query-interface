import Box from "@mui/material/Box"
import { useEffect, useState } from "react"
import FormControl from "@mui/material/FormControl"
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Dimension from "@/components/TreeStructure/Dimension"
import { useDispatch, useSelector } from "react-redux"
import { add_to_prefix_list, clear_for_dataset_change, update_dataset, update_dimension_tree, update_measure_list } from "@/lib/redux/action"
import { CircularProgress } from "@mui/material"
import Measure from "@/components/TreeStructure/Measure"
import { Troubleshoot } from "@mui/icons-material"
import { splitIRI } from "@/lib/custom/helper"


const DatasetTab = ({}) => {

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const [schemaName, setSchemaName] = useState('')
    const [totalObs, setTotalObs] = useState(0)

    const tbox = useSelector((state) => state.datasetReducer.tbox);
    const abox = useSelector((state) => state.datasetReducer.abox);
    const dataset = useSelector((state) => state.datasetReducer.dataset)
    const datasetList = useSelector((state) => state.datasetReducer.datasetList)

    const prefixes = useSelector((state) => state.datasetReducer.prefixes)
    
    const treeStructures = useSelector((state) => state.datasetReducer.treeStructures)

    const measuresList = useSelector((state) => state.datasetReducer.measuresList);

    const getMetaDataOfDataset = async()=>{
        const splittedDataset = dataset.split(':')
        var datasetIRI = prefixes[splittedDataset[0]]+splittedDataset[1]
        const res = await fetch('/api/get_metadata_of_dataset', {
            method: "POST",
            body:JSON.stringify({tbox:tbox,abox:abox,dataset:datasetIRI})}
        )
        if(res){
            var data = await res.json()
            data = data.data
            if(data){
                const splittedSchemaIRI = splitIRI(data.cuboid.value)
                var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
                if(splittedSchemaIRI[0] in tempPrefixes !== true){
                    var tempID = Math.floor((Math.random() * 100) + 1);
                    if("prefix" in tempPrefixes !==Troubleshoot) tempID = ""
                    else{
                        while(("prefix"+tempID) in tempPrefixes){ 
                            tempID = Math.floor((Math.random() * 100) + 1);
                        }
                    }
                    tempPrefixes[splittedSchemaIRI[0]] =  "prefix"+tempID;
                    tempPrefixes["prefix"+tempID] =  splittedSchemaIRI[0];
                    
                    setSchemaName("prefix"+tempID+":"+splittedSchemaIRI[1]);
                }    
                else{
                    setSchemaName(tempPrefixes[splittedSchemaIRI[0]]+":"+splittedSchemaIRI[1]);
                }
                dispatch(add_to_prefix_list(tempPrefixes))
                setTotalObs(data.numobs.value)
            }
            else{
                setSchemaName('')
            }

        }
        else{
            console.log("couldn't fetch the number of Observations...")
        }
    }

    const getTreeStructure = async ()=>{ 
        setLoading(true) 
        const splittedDataset = dataset.split(':')
        var datasetIRI = prefixes[splittedDataset[0]]+splittedDataset[1]
        if(treeStructures && 
            treeStructures.datasetIRI){
                setLoading(false)
                return  
        }

        const res = await fetch('/api/get_dimension_tree', {
            method: "POST",
            body:JSON.stringify({tbox:tbox,abox:abox,dataset:datasetIRI})}
        )
        if(res){
            const data = await res.json()
            const dimensionTree = data.treeStructure
            dispatch(update_dimension_tree({...treeStructures, [datasetIRI]:dimensionTree}))
        }
        else{
            console.log("couldn't fetch the tree structure...")
        }
        setLoading(false)
    }


    const getMeasureList = async () =>{
        setLoading(true) 
        const splittedDataset = dataset.split(':')
        var datasetIRI = prefixes[splittedDataset[0]]+splittedDataset[1]
        if(measuresList && 
            measuresList.datasetIRI){
                setLoading(false)
                return  
        }

        const res = await fetch('/api/get_measure_list', {
            method: "POST",
            body:JSON.stringify({tbox:tbox,dataset:datasetIRI})}
        )
        if(res){
            const data = await res.json()
            dispatch(update_measure_list({...measuresList, [datasetIRI]:data}))
        }
        else{
            console.log("couldn't fetch the tree structure...")
        }
        setLoading(false)
    }


    useEffect(() => {
        if(dataset.length>0) {
            getMetaDataOfDataset()
            getTreeStructure()
            getMeasureList()
            dispatch(clear_for_dataset_change())
        }
    }, [dataset])

    return (
        <Box className="w-full mt-3">
            <FormControl fullWidth className="">
                <InputLabel id='dataset-label' sx={{fontSize:'90%',verticalAlign:'middle',top:'-10%'}}>Datasets</InputLabel>
                <Select
                    disabled={datasetList.length<1}
                    labelId="dataset-select"
                    sx={{width:'100%',height:'40px'}}
                    label='Dataset'
                    value={dataset}
                    onChange={(e)=>dispatch(update_dataset(e.target.value,prefixes))}>

                    {datasetList.map((item, idx) => (
                        <MenuItem key={`dataset_${idx}`} value={item}>{item}</MenuItem>
                    ))}

                </Select>
            </FormControl>
            <Box className="flex flex-col border-y-2 my-3">
                <small>Schema IRI: {schemaName}</small>
                <small>Total Number of Observations: {totalObs}</small>
            </Box>

            <Box className="py-1">
                <b>Dimensions</b>
                {
                    dataset.length>0 && treeStructures[prefixes[dataset.split(':')[0]]+dataset.split(':')[1]] && treeStructures[prefixes[dataset.split(':')[0]]+dataset.split(':')[1]].dimensions.map(d=>(
                        <Dimension key={d.name} info={d}/>
                    ))
                    
                }
            </Box>
            <Box className="py-1">
                <b>Measures</b>
                {
                   dataset.length>0 && measuresList[prefixes[dataset.split(':')[0]]+dataset.split(':')[1]] && measuresList[prefixes[dataset.split(':')[0]]+dataset.split(':')[1]].Measures.map(m=>(
                        <Measure key={m.measureName} info={m}/>
                   ))
                }
            </Box>
            {
                loading && <Box sx={{height:'100px',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <CircularProgress sx={{color:'#08094f'}}/>
                </Box>
            }
             
    </Box>
    )
}

export default DatasetTab