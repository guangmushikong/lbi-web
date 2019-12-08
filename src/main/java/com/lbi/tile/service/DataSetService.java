
package com.lbi.tile.service;

import com.lbi.tile.dao.DataSetDao;
import com.lbi.tile.dao.ProjectDao;
import com.lbi.tile.model.DataSetDO;
import com.lbi.tile.model.ProjectDO;
import com.vividsolutions.jts.geom.Geometry;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.geotools.data.shapefile.ShapefileDataStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.geotools.data.FeatureSource;
import org.geotools.feature.FeatureCollection;
import org.geotools.feature.FeatureIterator;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.feature.simple.SimpleFeatureType;
import org.opengis.feature.type.AttributeType;
import org.opengis.feature.type.GeometryType;
import org.opengis.feature.type.Name;
import java.io.File;
import java.nio.charset.Charset;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

/*************************************
 * Class Name: DataSetService
 * Description:〈数据集Service〉
 * @author deyi
 * @since 1.0.0
 ************************************/
@Service
@Slf4j
public class DataSetService {
    @Autowired
    DataSetDao dataSetDao;
    @Autowired
    ProjectDao projectDao;
    @Value("${service.tiledata}")
    String tiledata;

    public List<DataSetDO> listDataSet(){
        return dataSetDao.listDataSet();
    }

    public List<DataSetDO> listDataSet(long projectId){
        ProjectDO projectDO=projectDao.getProject(projectId);
        return dataSetDao.listDataSet(projectDO.getDatasetIds());
    }

    public void addDataSet(DataSetDO dataSetDO){
        dataSetDao.addDataSet(dataSetDO);
    }

    public void updateDataSet(DataSetDO dataSetDO){
        dataSetDao.updateDataSet(dataSetDO);
    }

    public void delDataSet(long id){
        dataSetDao.delDataSet(id);
    }

    public void shp2PgTable(String layerName)throws Exception{
        String filePath=tiledata+ File.separator+layerName+".shp";
        log.info("【path】"+filePath);
        ShapefileDataStore shpDataStore = new ShapefileDataStore(new File(filePath).toURI().toURL());
        shpDataStore.setCharset(Charset.forName("GBK"));
        String typeName = shpDataStore.getTypeNames()[0];
        log.info("【typeName】"+typeName);
        SimpleFeatureType simpleFeatureType=shpDataStore.getSchema();
        GeometryType geometryType=simpleFeatureType.getGeometryDescriptor().getType();
        log.info("【geometryType】"+geometryType.getName());
        List<Name> nameList=new ArrayList<>();
        for(int i=0;i<simpleFeatureType.getAttributeCount();i++){
            AttributeType attributeType=simpleFeatureType.getType(i);
            if(geometryType.getName()!=attributeType.getName()){
                nameList.add(attributeType.getName());
            }
        }
        //创建表
        buildTable(layerName,simpleFeatureType,nameList);

        List<String> names = new ArrayList<>();
        List<String> vals = new ArrayList<>();
        for (Name fieldName : nameList) {
            names.add(fieldName.toString().toLowerCase());
            vals.add("?");
        }
        String iSql=String.format("insert into data.%s(%s,geom) values(%s,ST_GeomFromText(?,4326))",
                layerName,
                StringUtils.join(names, ","),
                StringUtils.join(vals, ","));
        int[] types= IntStream.range(0, nameList.size()+1).map(u-> Types.VARCHAR).toArray();
        saveFeatures(iSql,types,shpDataStore,nameList);
    }

    private void buildTable(
            String tableName,
            SimpleFeatureType type,
            List<Name> nameList){
        String dropTableSql=String.format("drop table if exists data.%s",tableName);
        log.info("【dropTable】"+dropTableSql);
        dataSetDao.executeSql(dropTableSql);

        StringBuilder sb=new StringBuilder();
        sb.append("create table if not exists data.").append(tableName);
        sb.append("(id bigserial primary key,");
        for(Name name:nameList){
            AttributeType attributeType=type.getType(name);
            sb.append(attributeType.getName().toString().toLowerCase()).append(" text,");
        }
        sb.append("geom geometry)");
        log.info("【creatTable】"+sb.toString());
        dataSetDao.executeSql(sb.toString());
        String indexSql=String.format("create index data_%s_geom_gist on data.%s using gist(geom)",tableName,tableName);
        log.info("【creatIndex】"+indexSql);
        dataSetDao.executeSql(indexSql);
    }

    private void saveFeatures(
            String iSql,
            int[] types,
            ShapefileDataStore shpDataStore,
            List<Name> nameList)throws Exception {

        String typeName = shpDataStore.getTypeNames()[0];
        FeatureSource<SimpleFeatureType, SimpleFeature> featureSource = shpDataStore.getFeatureSource(typeName);
        FeatureCollection<SimpleFeatureType, SimpleFeature> result = featureSource.getFeatures();
        log.info("【total】"+result.size());
        FeatureIterator<SimpleFeature> itertor = result.features();
        while(itertor.hasNext()) {
            SimpleFeature feature = itertor.next();
            List<String> valueList = new ArrayList<>();
            for (Name fieldName : nameList) {
                String value=feature.getAttribute(fieldName).toString();
                valueList.add(value);
            }
            Geometry geometry = (Geometry) feature.getDefaultGeometry();
            valueList.add(geometry.toText());
            Object[] objects=valueList.stream().toArray();
            dataSetDao.saveRow(iSql,objects,types);
        }
    }
}
