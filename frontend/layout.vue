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
            <a class="nav-link" href="#/warehouse">Warehouse</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/pending">Pending</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/shipped">Shipped</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/received">Received</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/returned">Returned</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/finance">Finance</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#/api">API</a>
          </li>
        </ul>
      </div>
    </nav>

    <div class="container-fluid mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>