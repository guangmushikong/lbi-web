package com.lbi.tile;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

/*************************************
 * Class Name: Application
 * Description:〈启动入口〉
 * @author deyi
 * @since 1.0.0
 ************************************/

@SpringBootApplication
@ServletComponentScan
public class Application {
    public static void main(String[] args){
        SpringApplication application = new SpringApplication(Application.class);
        application.setBannerMode(Banner.Mode.OFF);
        application.run(args);
    }
}
