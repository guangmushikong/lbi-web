package com.lbi.tile.dao;

import com.lbi.tile.model.Stat;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;


import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.List;

@Repository(value="logDao")
@Slf4j
public class LogDao extends CommonDao{
    @Value("${spring.table.t_log}")
    String t_log;

    public List<Stat> getLogStat(String sql){
        List<Stat> list=null;
        try{
            //System.out.println("sql:"+sql);
            list=jdbcTemplate.query(
                    sql,
                    new RowMapper<Stat>() {
                        public Stat mapRow(ResultSet rs, int i) throws SQLException {
                            Stat u=new Stat();
                            u.setName(rs.getString("ip"));
                            u.setPeriod(rs.getLong("time"));
                            u.setTotal(rs.getLong("total"));
                            return u;
                        }
                    });
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return list;
    }

    /**
     * 获取统计Top IP列表
     * @param kind  1大于且等于,2等于
     * @param ds    日期
     * @param limit 限制
     * @param filterIPs 过滤IP列表
     * @return IP列表
     */
    public List<String> getTopIpList(int kind,long ds,int limit,List<String> filterIPs){
        List<String> list=null;
        try{
            StringBuilder sb=new StringBuilder();
            sb.append("select ip from "+t_log);
            if(kind==1){
                sb.append(" where to_char(log_time,'yyyymmdd')::bigint>="+ds);
            }else{
                sb.append(" where to_char(log_time,'yyyymmdd')::bigint="+ds);
            }
            if(filterIPs!=null){
                sb.append(" and ip not in ('"+StringUtils.join(filterIPs,"','")+"')");
            }
            sb.append(" group by ip");
            sb.append(" order by count(1) desc limit "+limit);
            //System.out.println("sql:"+sb.toString());
            list=jdbcTemplate.query(
                    sb.toString(),
                    new RowMapper<String>() {
                        public String mapRow(ResultSet rs, int i) throws SQLException {
                            return rs.getString("ip");
                        }
                    });
        }catch (Exception e){
            e.printStackTrace();
            log.error(e.getMessage());
        }
        return list;
    }

}
