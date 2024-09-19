import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Page from '../../layout/Page';
import { TeamList, MyTeamList, NewTeam } from '../../pages/TeamList';
import { UserList } from '../../pages/UserList';
import { PokemonList } from '../../pages/PokemonList';
import { Team } from '../../containers/Team';

jest.mock('../../pages/TeamList', () => ({
  TeamList: () => <div>Mocked TeamList</div>,
  MyTeamList: () => <div>Mocked MyTeamList</div>,
  NewTeam: () => <div>Mocked NewTeam</div>
}));

jest.mock('../../pages/UserList', () => ({
  UserList: () => <div>Mocked UserList</div>
}));

jest.mock('../../pages/PokemonList', () => ({
  PokemonList: () => <div>Mocked PokemonList</div>
}));

jest.mock('../../containers/Team', () => ({
  Team: () => <div>Mocked Team</div>
}));

describe('Page Component', () => {

  test('renders NewTeam component when type is "new-team"', () => {
    render(<Page type="new-team" />);
    expect(screen.getByText('Create a new team')).toBeInTheDocument();
    expect(screen.getByText('Mocked NewTeam')).toBeInTheDocument();
  });

  test('renders PokemonList component when type is "pokemon"', () => {
    render(<Page type="pokemon" />);
    expect(screen.getByText('All Pokemon')).toBeInTheDocument();
    expect(screen.getByText('Mocked PokemonList')).toBeInTheDocument();
  });

  test('renders TeamList component when type is "teams"', () => {
    render(<Page type="teams" />);
    expect(screen.getByText('All teams')).toBeInTheDocument();
    expect(screen.getByText('Mocked TeamList')).toBeInTheDocument();
  });

  test('renders MyTeamList component when type is "my-teams"', () => {
    render(<Page type="my-teams" />);
    expect(screen.getByText('Your teams')).toBeInTheDocument();
    expect(screen.getByText('Mocked MyTeamList')).toBeInTheDocument();
  });

  test('renders UserList component when type is "users"', () => {
    render(<Page type="users" />);
    expect(screen.getByText('All users')).toBeInTheDocument();
    expect(screen.getByText('Mocked UserList')).toBeInTheDocument();
  });

  test('renders Team component when type is "team-details"', () => {
    render(<Page type="team-details" />);
    expect(screen.getByText('Team details')).toBeInTheDocument();
    expect(screen.getByText('Mocked Team')).toBeInTheDocument();
  });

  test('renders "Type not supported" message when type is unknown', () => {
    render(<Page type="unknown" />);
    expect(screen.getByText('Type not supported')).toBeInTheDocument();
  });

});
