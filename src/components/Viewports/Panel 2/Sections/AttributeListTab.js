import { add_to_prefix_list, update_level_attribute_to_view_list, update_level_instances, update_selected_level_data } from '@/lib/redux/action'
import Box from '@mui/material/Box'
import FormControl from "@mui/material/FormControl"
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography'
import {  useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DataGrid } from '@mui/x-data-grid'
import { splitIRI } from "@/lib/custom/helper"

export default function AttributeListTab() {

    const dispatch = useDispatch()
    
    const [levelName, setLevelName] = useState('')
    const [selectedAttribute, setSelectedAttribute] = useState({originalIRI:'',prefixIRI:''})
    const [selectedToBeViewedAttribute, setSelectedToBeViewedAttribute] = useState('')

    const [rows, setRows] = useState([])
    
    const col = [{
        field: selectedAttribute.prefixIRI,
        headerName: selectedAttribute.prefixIRI,
        width: 300,
        renderCell: (params)=>{
            return params.row.type === 'uri' ? (
                <a style={{color:'blue'}} href={params.row.value} target="_blank" rel="noopener">
                    {params.row.value}
                </a>
            ) : (
            params.row.value
            );
        },
        editable: false,
      }]

    const selectedLevelData = useSelector((state) => state.datasetReducer.selectedLevelData);
    
    const prefixes = useSelector((state) => state.datasetReducer.prefixes)
    
    
    const filterConditions = ['Equal to (=)', 'Not Equal to (!=)',
        'Greater Than (>)', 'Greater or Equal (>=)',
        'Less Than (<)', 'Less or Equal (<=)'
    ]

    const update_level_name_prefix = ()=>{
        const splittedName = splitIRI(selectedLevelData.levelName)
        setLevelName(prefixes[splittedName[0]]+":"+splittedName[1]);
    }

    const update_attribute_name_prefix = ()=>{
        if(selectedLevelData.attributes[0].prefixIRI) return;
        const tempAttributeList = []
        var tempPrefixes = JSON.parse(JSON.stringify(prefixes))
        var tempID = ''

        selectedLevelData.attributes.forEach((a,idx)=>{
            const splittedName = splitIRI(a.attributeName)
            if(splittedName[0] in tempPrefixes !== true){
                tempPrefixes[splittedName[0]] =  "prefix"+tempID;
                tempPrefixes["prefix"+tempID] =  splittedName[0];
                tempAttributeList.push({
                    ...a,
                    prefixIRI: "prefix"+tempID + ":" + splittedName[1]
                })
                if(tempID === '') tempID = 1;
                else tempID++;
            }
            else{
                tempAttributeList.push({
                    ...a,
                    prefixIRI: tempPrefixes[splittedName[0]]+":"+splittedName[1]
                })
            }
        })
        dispatch(add_to_prefix_list(tempPrefixes))
        dispatch(update_selected_level_data({...selectedLevelData,attributes:tempAttributeList}))
    }

    const handleAttributesToBeViewed = (e) => {
        const attributeIRIs = e.target.value;

        setSelectedToBeViewedAttribute(attributeIRIs.join(","))
    };

    const handleUpdateFilteringInstances = (ids)=>{
        var selectedInstances = []
        selectedLevelData.attributes.map((a)=>{
            if(a.prefixIRI===selectedAttribute.prefixIRI){
                a.attributeValues.map((val,idx)=>{
                    if(ids.includes(idx)==true) selectedInstances.push(val)
                })
            }
        })
        dispatch(update_level_instances(selectedLevelData.levelName, selectedAttribute, selectedInstances))
    }
    
    
    const renderValue = (selected) => selected.join(', ');

    useEffect(() => {
      if(selectedLevelData && selectedLevelData.levelName){ 
        update_level_name_prefix()
        update_attribute_name_prefix()
        setSelectedAttribute({originalIRI:'',prefixIRI:''})
        setSelectedToBeViewedAttribute('')
        setRows([])
      }
    }, [selectedLevelData])

    useEffect(() => {
        if(selectedAttribute.originalIRI.length>0){
            var tempAttribute = selectedLevelData.attributes.filter((a) =>
                a.attributeName == selectedAttribute.originalIRI
            )
            tempAttribute = tempAttribute[0]

            const tempRows = tempAttribute.attributeValues.map((a,id) =>{
                return {...a, id:id}
            })
            setRows(tempRows)
        }
        
    }, [selectedAttribute])

    useEffect(()=>{
        if(selectedToBeViewedAttribute.length>0){
            var updatedAttrToBeViewed = []
            selectedToBeViewedAttribute.split(',').map((a,id) => {
                const [baseURI, attrName] = a.split(':')
                updatedAttrToBeViewed.push({
                    "attributeName": prefixes[baseURI] +attrName,
                    "prefixName": a
                })
            })
            dispatch(update_level_attribute_to_view_list(selectedLevelData.levelName,updatedAttrToBeViewed))
        }
    },[selectedToBeViewedAttribute])

    return (
        <Box className="w-full">
            <Typography sx={{color:'#08094f',fontSize:'14px'}}>
                Selected level: <b>{selectedLevelData && levelName.length>0 && levelName}</b>
            </Typography>
            <FormControl fullWidth sx={{ marginTop: '8px' }}>
                <InputLabel id='level-attribute-label'>Attributes</InputLabel>
                <Select
                    labelId="level-attribute-label"
                    sx={{width:'100%',height:'40px'}}
                    label='Level Attribute'
                    disabled={!(selectedLevelData.levelName)}
                    value={
                        selectedAttribute.originalIRI !=="" ?
                        selectedAttribute.originalIRI+'&&'+selectedAttribute.prefixIRI :
                        ''
                    }
                    onChange={(e)=>{
                        setSelectedAttribute({
                            originalIRI:e.target.value.split('&&')[0],
                            prefixIRI: e.target.value.split('&&')[1]
                        })}}>
                    {
                        selectedLevelData && selectedLevelData.attributes && selectedLevelData.attributes[0].prefixIRI && selectedLevelData.attributes.map((a, idx) => (
                            <MenuItem name={a.prefixIRI} key={a.attributeName} value={a.attributeName+'&&'+a.prefixIRI}>{a.prefixIRI}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: '15px' }}>
                <InputLabel id='filter-cond-label'>Filter Conditions</InputLabel>
                <Select
                    labelId="filter-cond-select"
                    sx={{ width: '100%',height:'40px' }}
                    label='Filter Condition'
                    value={filterConditions[0]}
                    onChange={()=>{}}
                    defaultValue={filterConditions[0]}>
                    {
                        filterConditions.map((item, idx) => (
                            idx? 
                            <MenuItem disabled key={`level_prop_${idx}`} value={item}>{item}</MenuItem>:
                            <MenuItem key={`level_prop_${idx}`} value={item}>{item}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormControl fullWidth sx={{ marginTop: '15px' }}>
                <InputLabel id='level-attr-label' sx={{fontSize:'90%',top:'-10%'}}>To Be Viewed Property</InputLabel>
                <Select
                    labelId="level-attr-to-be-viewed"
                    sx={{ width: '100%',height:'40px' }}
                    label='To be Viewed Attributes'
                    disabled={!(selectedLevelData.levelName)}
                    value={selectedToBeViewedAttribute ? selectedToBeViewedAttribute.split(',') : []}
                    onChange={(e)=>{handleAttributesToBeViewed(e)}}
                    renderValue={renderValue}
                    multiple
                    >
                    {
                        selectedLevelData && selectedLevelData.attributes && selectedLevelData.attributes[0].prefixIRI && selectedLevelData.attributes.map((a, idx) => (
                            
                            <MenuItem name={a.prefixIRI} key={a.attributeName} value={a.prefixIRI}>
                                <Checkbox checked={selectedToBeViewedAttribute.split(',').indexOf(a.prefixIRI) > -1} />
                                <ListItemText primary={a.prefixIRI} />
                          </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <Box className={"mt-2"} sx={{ height: '75vh', width: '100%' }}>

                <DataGrid 
                    rows={rows}
                    columns={col}
                    onRowSelectionModelChange={(e)=>{handleUpdateFilteringInstances(e)}}
                    checkboxSelection
                />
            </Box>
            
    </Box>
  )
}
