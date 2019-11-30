class Player
  has_many :games
end

class Puzzle
  attr :difficulty
  attr :starting_grid
  attr :solved_grid
end

class Game
  belongs_to :puzzle
  has_many :changes # making undo/redo  easier
  has_many :play_intervals # a set of times that the game was being played during. useful for checking play duration and how often users pause

  attr :state # state of the game
end

class Change
  # setting the value of a cell to another value by either changing the guess or changing the hint
  has_one :grid
  belongs_to :game
  has_one :previous_change
end
