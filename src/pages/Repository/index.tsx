import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import { DefaultTheme } from 'styled-components';
import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

import usePeristedState from '../../utils/usePersistedState';

import * as S from './styles';

interface RepositoryProps {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface IssueProps {
  title: string;
  id: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: {
    id:string;
    name:string;
    color?: string;
  }

}

interface ILabelsProps {
    id:string;
    name: string;
    color?: string;

}

interface RepositoryParamsProps {
  repository: string;
}

const Repository = () => {
  const [repository, setRepositories] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);
  const [labels, setLabels] = useState<IssueProps[]>([]);
  const { params } = useRouteMatch<RepositoryParamsProps>();

  const [theme, setTheme] = usePeristedState<DefaultTheme>('theme', light);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepositories(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });

    api.get(`repos/${params.repository}/labels`).then((response) => {
    setLabels(response.data);
   console.log(response.data)
    });
  }, [params.repository]);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  const insertHashToColor = (color: string) => `#${color}`;

  return (
    <Layout isContentFull>
      <Header isLink="/dashboard" toggleTheme={toggleTheme} />
      <S.Container>
     {/*  <input
          type="text"
          placeholder="Digite aqui"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        /> */}
        {repository && (
          <S.RepositoryInfo>
            <div>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>
            </div>
            <ul>
              <li>
                <strong>{repository.open_issues_count}</strong>
                <span>Vagas abertas</span>
              </li>
            </ul>
          </S.RepositoryInfo>
        )}

        <S.Issues>
          {issues.map((issue) => (
            <a key={issue.id} href={issue.html_url}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <S.LabelContent>

               <S.Label color={issue.labels.color && insertHashToColor(issue.labels.color)}>{issue.labels.name}</S.Label>

              </S.LabelContent>

              <FiChevronRight size={20} />
            </a>
          ))}
        </S.Issues>
      </S.Container>
    </Layout>
  );
};

export default Repository;
