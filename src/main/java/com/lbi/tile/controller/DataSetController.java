
package com.lbi.tile.controller;

import com.alibaba.fastjson.JSON;
import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ResultBody;
import com.lbi.tile.service.DataSetService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*************************************
 * Class Name: DataSetController
 * Description:〈数据集Controller〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@CrossOrigin
@RestController
@RequestMapping("/dataset")
@Slf4j
public class DataSetController {
    @Autowired
    DataSetService dataSetService;

    @GetMapping(value="/list", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody listDataSet(
            @RequestParam(value = "projectId",required = false,defaultValue="-1") long projectId) {
        List<DataSetDO> list;
        if(projectId>0){
            list=dataSetService.listDataSet(projectId);
        }else {
            list=dataSetService.listDataSet();
        }
        return new ResultBody<>(list);
    }

    @PostMapping(value="/add", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody addDataSet(@RequestBody DataSetDO dataSetDO) {
        log.info("【addDataSet】"+ JSON.toJSONString(dataSetDO));
        dataSetService.addDataSet(dataSetDO);
        return new ResultBody<>(0,"OK");
    }

    @PostMapping(value="/save", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody updateDataSet(@RequestBody DataSetDO dataSetDO) {
        log.info("【updateDataSet】"+ JSON.toJSONString(dataSetDO));
        dataSetService.updateDataSet(dataSetDO);
        return new ResultBody<>(0,"OK");
    }

    @GetMapping(value="/del", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody delDataSet(@RequestParam("id") long id) {
        log.info("【delDataSet】id:{}",id);
        dataSetService.delDataSet(id);
        return new ResultBody<>(0,"OK");
    }

    @GetMapping("/syncShp")
    public ResultBody syncShp(@RequestParam("layerName") String layerName) {
        log.info("【syncShp】name:{}",layerName);
        try{
            dataSetService.shp2PgTable(layerName);
            return new ResultBody<>(0,"OK");
        }catch (Exception e){
            e.printStackTrace();
            return new ResultBody<>(-1,e.getMessage());
        }
    }
}
