
package com.lbi.tile.config;

import com.lbi.tile.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.DigestUtils;


/*************************************
 * Class Name: SecurityConfig
 * Description:〈安全配置〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    UserService userService;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/assets/**");
        web.ignoring().antMatchers("/scripts/**");
        web.ignoring().antMatchers("/");
        web.ignoring().antMatchers("/data/**");
        web.ignoring().antMatchers("/log/**");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth)throws Exception{
        auth.userDetailsService(userService)
                .passwordEncoder(new PasswordEncoder(){
                    @Override
                    public String encode(CharSequence rawPassword){
                        return DigestUtils.md5DigestAsHex(((String)rawPassword).getBytes());
                    }
                    @Override
                    public boolean matches(CharSequence rawPassword, String encodedPassword){
                        return encodedPassword.equals(DigestUtils.md5DigestAsHex(((String)rawPassword).getBytes()));
                    }
                });
    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .anyRequest().authenticated()
                .and().formLogin().loginPage("/login").failureUrl("/login?error").permitAll()
                .and().rememberMe().tokenValiditySeconds(60 * 10)
                .and().logout().logoutSuccessUrl("/").permitAll();
        http.csrf().disable();
    }
}
