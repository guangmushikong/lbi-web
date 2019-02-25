package com.lbi.tile.controller;

import com.lbi.model.ResultBody;
import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ProjectDO;
import com.lbi.tile.service.MetaService;

import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/meta")
public class MetaController {
    @Resource(name="metaService")
    MetaService metaService;


    @RequestMapping(value="/projects", method = RequestMethod.GET)
    public ResultBody getProjectList() {
        List<ProjectDO> list=metaService.getProjectList();
        return new ResultBody<>(list);
    }

    @RequestMapping(value="/projects/{projectId}", method = RequestMethod.GET)
    public ResultBody getProjectById(@PathVariable("projectId") long projectId) {
        ProjectDO u=metaService.getProjectById(projectId);
        return new ResultBody<>(u);

    }

    @RequestMapping(value="/datasets", method = RequestMethod.GET)
    public ResultBody getDateSetList() {
        List<DataSetDO> list=metaService.getDataSetList();
        return new ResultBody<>(list);
    }

    @RequestMapping(value="/datasets/{datasetId}", method = RequestMethod.GET)
    public ResultBody getDataSetDOById(
            @PathVariable("datasetId") long datasetId) {
        DataSetDO u=metaService.getDataSetById(datasetId);
        return new ResultBody<>(u);
    }

}
