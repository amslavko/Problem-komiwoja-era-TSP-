ALGORYTM GENETYCZNY DLA PROBLEMU KOMIWOJAZERA TSP

Projekt przedstawia rozwiazanie problemu komiwojazera (Traveling Salesman Problem) z wykorzystaniem algorytmu genetycznego.

OPIS FUNKCJONALNOSCI
Algorytm genetyczny z mozliwoscia konfiguracji parametrow.
Wizualizacja trasy w czasie rzeczywistym.
Wykres zbieznosci algorytmu.
Benchmarki wydajnosci.
Obsluga roznych zbiorow danych: Berlin52, CH150, D493.

STRUKTURA PROJEKTU
tsp-genetic-algorithm
index.html
css/style.css
js/tsp-solver.js
js/genetic-ops.js
js/visualizer.js
js/benchmark.js
js/main.js
data/berlin52.tsp
data/ch150.tsp
data/d493.tsp

URUCHOMIENIE
Otworzyc plik index.html w przegladarce.
Wybrac zbior danych.
Skonfigurowac parametry algorytmu.
Uruchomic algorytm.

PARAMETRY
Rozmiar populacji okresla liczbe osobnikow w jednej generacji.
Liczba pokolen okresla maksymalna liczbe iteracji.
Mutacja oznacza prawdopodobienstwo zmiany genow.
Elityzm oznacza liczbe najlepszych osobnikow zachowanych bez zmian.

ZBIORY DANYCH
Berlin52 zawiera 52 miasta, rozwiazanie optymalne wynosi okolo 7542.
CH150 zawiera 150 miast, rozwiazanie optymalne wynosi okolo 6528.
D493 zawiera 493 miasta, rozwiazanie optymalne wynosi okolo 35002.

ALGORYTM
Na poczatku tworzona jest losowa populacja.
Nastepnie wykonywana jest selekcja turniejowa.
Kolejnym krokiem jest krzyzowanie typu Order Crossover.
Nastepnie wykonywana jest mutacja typu swap.
Najlepsze rozwiazania sa zachowywane dzieki elityzmowi.

LICENCJA
MIT License
