import { ADD_TO_ALL_LEVEL_DATA, ADD_TO_PREFIX_LIST, CLEAR_FOR_DATASET_CHANGE, REMOVE_AN_AGGREGATE_FUNCTION_FROM_A_MEASURE, REMOVE_LEVEL, REMOVE_MEASURE_FROM_SELECTED_MEASURE_LIST, TRY_TO_ADD_LEVEL, UPDATE_ABOX, UPDATE_DATASET, UPDATE_DATASET_LIST, UPDATE_DIMENSION_TREES, UPDATE_LEVEL_ATTRIBUTES_TO_VIEW_LIST, UPDATE_LEVEL_INSTANCES, UPDATE_MEASURE_LIST, UPDATE_SELECTED_LEVEL_DATA, UPDATE_SELECTED_MEASURE_LIST, UPDATE_TBOX } from "./type";


// common
export const update_TBox = (tbox)=> ({
    type: UPDATE_TBOX,
    tbox
})

export const update_ABox = (abox) => ({
    type: UPDATE_ABOX,
    abox
})

export const update_dataset = (dataset,prefixes) => ({
    type: UPDATE_DATASET,
    dataset,
    prefixes
})


// dataset Reducer

export const update_dataset_list = (datasetList) => ({
    type: UPDATE_DATASET_LIST,
    datasetList
})

export const add_to_prefix_list = (prefixes) => ({
    type: ADD_TO_PREFIX_LIST,
    prefixes
})

export const update_dimension_tree = (treeStructures)=>({
    type: UPDATE_DIMENSION_TREES,
    treeStructures
})

export const update_measure_list = (measuresList) => ({
    type: UPDATE_MEASURE_LIST,
    measuresList
})

export const update_selected_level_data = (selectedLevelData) => ({
    type: UPDATE_SELECTED_LEVEL_DATA,
    selectedLevelData
})

export const add_to_all_level_data = (levelName, levelData) => ({
    type: ADD_TO_ALL_LEVEL_DATA,
    levelName,
    newLevelData: levelData
})


// Actions for Query Reducer

export const try_to_add_level = (levelInfo) =>({
    type: TRY_TO_ADD_LEVEL,
    levelInfo
})

export const remove_level = (levelName) => ({
    type: REMOVE_LEVEL,
    levelName
})

export const update_selected_measure_list = (measures) => ({
    type: UPDATE_SELECTED_MEASURE_LIST,
    measures
})

export const remove_measure_from_selected_measure_list = (measureName) => ({
    type: REMOVE_MEASURE_FROM_SELECTED_MEASURE_LIST,
    measureName
})

export const remove_an_aggregate_function_from_a_measure = (aggFuncName, measureName) => ({
    type: REMOVE_AN_AGGREGATE_FUNCTION_FROM_A_MEASURE,
    aggFuncName,
    measureName
})

export const update_level_attribute_to_view_list = (levelName, attributeList) => ({
    type: UPDATE_LEVEL_ATTRIBUTES_TO_VIEW_LIST,
    levelName,
    attributeList
}) 

export const update_level_instances = (levelName, attribute, instances) => ({
    type: UPDATE_LEVEL_INSTANCES,
    levelName,
    instances,
    attribute
})

export const clear_for_dataset_change = ()=>({
    type: CLEAR_FOR_DATASET_CHANGE
})