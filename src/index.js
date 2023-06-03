import 'regenerator-runtime/runtime';
import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'

import './styles/index.scss'

import DemosMenu from './js/components/DemosMenu'
import DemoEarrings3D from './js/demos/VTOEarrings.js'
import DemoNecklace3D from './js/demos/VTONecklace.js'

render(
  <AppContainer>
    <Router>
      <Switch>

        <Route path="/earrings3D/:model_id">
          <DemoEarrings3D />
        </Route>

        <Route path="/necklace3D/:model_id">
          <DemoNecklace3D />
        </Route>

        <Route path="/">
          <DemosMenu />
        </Route>

      </Switch>
    </Router>
  </AppContainer>,
  document.querySelector('#root')
);