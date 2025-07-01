import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CodeModal from '../GeneratedSparqlCode/CodeModal';
import { useEffect, useState } from 'react';
import ResultModal from '../Results/ResultModal';

export default function ActionButtonGroup() {

    const [loading, setLoading] = useState(false)

    const [disableActionBtns, setDisableActionBtns] = useState(true)

    const [codeModalOpen, setCodeModalOpen] = useState(false)
    const [resultsTabOpen, setResultsTabOpen] = useState(false)
    
    const [query, setQuery] = useState(`# Your Sparql Code is loading....`)
    const [resultData, setResultData] = useState([])

    const [resultGenTime, setResultGenTime] = useState('')

    
    const everyThingForQuery = useSelector(state=>state.queryReducer)


    const fetchSparqlQuery = async () => {
        setLoading(true)
        const response = await fetch('/api/get_sparql_query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(everyThingForQuery)
        });
      
        if (!response) {
          alert('Network response was not ok');
        }

        const {query} = await response.json();
        setLoading(false)
        setQuery(query)
      };

    const fetchResults = async ()=>{
        setLoading(true)
        setResultsTabOpen(true)
        const startTime = Date.now();
        const response = await fetch('/api/get_query_result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sparql:query})
        });
        if (!response) {
            alert('Network response was not ok');
        }
        const endTime = Date.now();

        setResultGenTime(endTime-startTime)
        const {data} = await response.json();
        setResultData(data)
        setLoading(false)
    }
    

    useEffect(() => {
      
        if(everyThingForQuery.selectedMeasures.length >0 && JSON.stringify(everyThingForQuery.selectedLevels)!=="{}"){
            setDisableActionBtns(false)
            fetchSparqlQuery()
        }
        else{
            setDisableActionBtns(true)
        }
    }, [everyThingForQuery])
    


    return (
        <Box className='w-full min-h-20 flex justify-center items-center'>
            <Button 
                disabled={disableActionBtns} 
                startIcon={<CodeIcon/>} 
                onClick={()=>{setCodeModalOpen(true)}}
                className='h-full py-4 px-6 font-bold mx-8 text-cyan-950 border-4 border-cyan-950 transition duration-400' 
                sx={{':hover':{borderWidth:'4px', borderColor:'transparent',backgroundColor:'#d3dde8'}}} 
                variant="outlined">
                Generate Query
            </Button>
            <Button 
                disabled={disableActionBtns} 
                startIcon={<PlayArrowIcon/>} 
                onClick={()=>{fetchResults()}}
                className='h-full py-4 px-6 font-bold mx-8 text-cyan-950 border-4 border-cyan-950 transition duration-400' 
                sx={{':hover':{borderWidth:'4px', borderColor:'transparent',backgroundColor:'#d3dde8'}}} 
                variant="outlined">
                Execute Query
            </Button>
            <CodeModal query={query} open={codeModalOpen} setOpen={setCodeModalOpen} loading={loading} />
            <ResultModal resultGenTime={resultGenTime} open={resultsTabOpen} resultData={resultData} setOpen={setResultsTabOpen} loading={loading} />
        </Box>
    )
}
