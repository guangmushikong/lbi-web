package com.lbi.tile.config;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Enumeration;

import static org.apache.commons.lang3.StringUtils.isNoneEmpty;

@WebFilter
@Slf4j
public class SessionFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest request=(HttpServletRequest)req;

        String url = request.getRequestURI();

        if(url.startsWith("/assets/")
                || url.startsWith("/scripts/")
                || url.startsWith("/favicon.ico")){
            chain.doFilter(req, res);
        }else {
            long star = System.currentTimeMillis();
            String remoteAddr = getRemortIP(request);
            String queryString = request.getQueryString();
            String method = request.getMethod();
            if (method.equalsIgnoreCase("POST")) {// 遍历post参数
                Enumeration<String> e = request.getParameterNames();
                String parameterName, parameterValue;
                while (e.hasMoreElements()) {
                    parameterName = e.nextElement();
                    parameterValue = request.getParameter(parameterName);
                    url += "&" + parameterName + "=" + parameterValue;
                }
                url=url.replaceAll("'", "\"");
            } else {
                if (isNoneEmpty(queryString)
                        && method.equalsIgnoreCase("GET")) {
                    url += "&" + queryString;
                }
                url = url.replaceFirst("&", "?");
            }

            chain.doFilter(req, res);

            long end = System.currentTimeMillis();
            MDC.put("ip", remoteAddr);
            long duration=(end - star);
            MDC.put("duration", String.valueOf (duration));
            MDC.put("method", method);
            log.info(url);
        }

    }
    @Override
    public void init(FilterConfig filterConfig) {}
    @Override
    public void destroy() {}

    private String getRemortIP(HttpServletRequest request) {
        if (request.getHeader("x-forwarded-for") == null) return request.getRemoteAddr();
        else return request.getHeader("x-forwarded-for");
    }
}
