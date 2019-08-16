package com.lbi.tile;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.cloud.openfeign.EnableFeignClients;

/*************************************
 * Class Name: Application
 * Description:〈启动入口〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
@EnableZuulProxy
@ServletComponentScan
public class Application {
    public static void main(String[] args){
        SpringApplication application = new SpringApplication(Application.class);
        application.setBannerMode(Banner.Mode.OFF);
        application.run(args);
    }
}
