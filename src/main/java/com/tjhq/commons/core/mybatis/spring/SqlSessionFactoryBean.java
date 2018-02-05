
package com.tjhq.commons.core.mybatis.spring;

import java.io.IOException;

import org.apache.ibatis.executor.ErrorContext;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.core.NestedIOException;

public class SqlSessionFactoryBean extends org.mybatis.spring.SqlSessionFactoryBean {

    @Override
    protected SqlSessionFactory buildSqlSessionFactory() throws IOException {
        try {
            return super.buildSqlSessionFactory();
        } catch (NestedIOException e) {
            e.printStackTrace();
            throw e;
        } finally {
            ErrorContext.instance().reset();
        }
    }
}
