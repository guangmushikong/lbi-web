package com.lbi.tile.controller;

import com.lbi.tile.model.ResultBody;
import com.lbi.tile.model.Stat;
import com.lbi.tile.service.LogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/log")
public class LogController {
    @Autowired
    private LogService logService;

    @GetMapping(value="/getdaystat", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultBody getDayStatList(@RequestParam("kind") int kind) {
        List<Stat> list=new ArrayList<>();
        if(kind==1)list=logService.getThisDayList();
        else if(kind==2)list=logService.getLastDayList();
        else if(kind==3)list=logService.getLast7DayList();
        else if(kind==4)list=logService.getLast1MonthList();
        return new ResultBody<>(list);
    }

}
