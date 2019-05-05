package com.lbi.tile.controller;

import com.lbi.model.ResultBody;
import com.lbi.tile.service.RefactorLBSServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/meta")
public class MetaController {
    @Autowired
    RefactorLBSServer refactorLBSServer;


    @RequestMapping(value="/projects", method = RequestMethod.GET)
    public ResultBody getProjectList() {
        return refactorLBSServer.getProjectList();
    }

    @RequestMapping(value="/projects/{projectId}", method = RequestMethod.GET)
    public ResultBody getProjectById(@PathVariable("projectId") long projectId) {
        return refactorLBSServer.getProject(projectId);

    }

    @RequestMapping(value="/datasets", method = RequestMethod.GET)
    public ResultBody getDateSetList() {
        return refactorLBSServer.getAllatasetList();
    }

    @RequestMapping(value="/datasets/{datasetId}", method = RequestMethod.GET)
    public ResultBody getDataSetDOById(
            @PathVariable("datasetId") long datasetId) {
        return refactorLBSServer.getDataset(0,datasetId);
    }


}
