<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#/">dshipchina</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/warehouse" class="nav-link" active-class="active">Warehouse</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/pending" class="nav-link" active-class="active">Pending</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/shipped" class="nav-link" active-class="active">Shipped</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/received" class="nav-link" active-class="active">Received</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/returned" class="nav-link" active-class="active">Returned</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/finance" class="nav-link" active-class="active">Finance</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/api" class="nav-link" active-class="active">API</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container-fluid mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>