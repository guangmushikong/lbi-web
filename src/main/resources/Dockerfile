FROM centos/java8
ADD lbi-web-1.0-SNAPSHOT.jar lbi-web-1.0-SNAPSHOT.jar
ADD bootstrap.yml bootstrap.yml
ENV LANG en_US.utf8
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN bash -c 'touch /lbi-web-1.0-SNAPSHOT.jar'
EXPOSE 8888
ENTRYPOINT ["java","-jar","/lbi-web-1.0-SNAPSHOT.jar"]